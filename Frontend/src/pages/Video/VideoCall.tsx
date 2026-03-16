import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../../Context/SocketContext";
import { UserContext } from "../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";

// simple 3-person mesh (max 3 including you)
const VideoCall = () => {
  const socket = useContext(SocketContext);
  const { user } = useContext(UserContext)!;
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isScreenSharingRef = useRef(false);
  const joinedRoomRef = useRef<string | null>(null);

  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const pendingICERef = useRef<Record<string, RTCIceCandidateInit[]>>({});
  const offeredRef = useRef<Record<string, boolean>>({});

  const [participants, setParticipants] = useState<
    { userId?: string; name?: string; profilePic?: string; socketId?: string }[]
  >([]);
  const [remoteStreams, setRemoteStreams] = useState<
    { socketId: string; stream: MediaStream }[]
  >([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupVideo = async () => {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      });

      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsReady(true);
    };

    setupVideo();
  }, []);

  useEffect(() => {
    if (localVideoRef.current && streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [remoteStreams.length]);

  const leaveRoom = () => {
    if (!socket) return;
    socket.emit("leave-room", meetingId);
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("left-room-success", () => {
      navigate("/");
    });
    return () => {
      socket.off("left-room-success");
    };
  }, []);
  const upsertRemoteStream = (socketId: string, stream: MediaStream) => {
    setRemoteStreams((prev) => {
      const found = prev.some((p) => p.socketId === socketId);
      if (!found) return [...prev, { socketId, stream }];
      return prev.map((p) =>
        p.socketId === socketId ? { socketId, stream } : p,
      );
    });
  };

  const removePeer = (socketId: string) => {
    const pc = peersRef.current[socketId];
    if (pc) pc.close();
    delete peersRef.current[socketId];
    delete pendingICERef.current[socketId];
    delete offeredRef.current[socketId];
    setRemoteStreams((prev) => prev.filter((p) => p.socketId !== socketId));
  };

  const createPeer = (socketId: string) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (!socket || !event.candidate) return;
      socket.emit("ice-candidate", {
        to: socketId,
        from: socket.id,
        candidate: event.candidate,
        meetingId,
      });
    };

    pc.ontrack = (event) => {
      upsertRemoteStream(socketId, event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (
        state === "failed" ||
        state === "closed" ||
        state === "disconnected"
      ) {
        removePeer(socketId);
      }
    };

    streamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, streamRef.current!);
    });

    peersRef.current[socketId] = pc;
    return pc;
  };

  const makeOffer = async (peerId: string) => {
    if (!socket) return;
    const pc = createPeer(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    offeredRef.current[peerId] = true;
    socket.emit("offer", { to: peerId, from: socket.id, offer, meetingId });
  };

  // peerconnection add/remove according to users in room
  const syncPeers = (users: any[]) => {
    if (!socket || !isReady) return;

    const myId = socket.id;
    const others = users.filter((u) => u.socketId && u.socketId !== myId);
    const otherIds = others.map((u) => u.socketId);

    // remove peers jo list me nahi hai
    Object.keys(peersRef.current).forEach((id) => {
      if (!otherIds.includes(id)) removePeer(id);
    });

    // create peer + offer rule
    others.forEach((u) => {
      createPeer(u.socketId);
      if (myId && myId > u.socketId && !offeredRef.current[u.socketId]) {
        makeOffer(u.socketId);
      }
    });
  };

  useEffect(() => {
    if (!isReady || participants.length === 0) return;
    syncPeers(participants);
  }, [isReady, participants]);

  useEffect(() => {
    if (!socket) return;

    const handleUsers = ({ users }: any) => {
      setParticipants(Array.isArray(users) ? users : []);
      syncPeers(Array.isArray(users) ? users : []);
    };

    const handleUserLeft = ({ socketId }: any) => {
      if (socketId) removePeer(socketId);
    };

    const handleOffer = async ({ from, offer }: any) => {
      if (!from || !offer) return;
      const pc = createPeer(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const pending = pendingICERef.current[from] || [];
      pending.forEach((c) => pc.addIceCandidate(c));
      pendingICERef.current[from] = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, from: socket.id, answer, meetingId });
    };

    const handleAnswer = async ({ from, answer }: any) => {
      if (!from || !answer) return;
      const pc = peersRef.current[from];
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));

      const pending = pendingICERef.current[from] || [];
      pending.forEach((c) => pc.addIceCandidate(c));
      pendingICERef.current[from] = [];
    };

    const handleIce = async ({ from, candidate }: any) => {
      if (!from || !candidate) return;
      const pc = peersRef.current[from];
      if (!pc || !pc.remoteDescription) {
        pendingICERef.current[from] = [
          ...(pendingICERef.current[from] || []),
          candidate,
        ];
        return;
      }
      await pc.addIceCandidate(candidate);
    };

    socket.on("Connected-Users", handleUsers);
    socket.on("userLeft", handleUserLeft);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);

    if (user && meetingId && joinedRoomRef.current !== meetingId) {
      joinedRoomRef.current = meetingId;
      socket.emit("join-room", { meetingId, name: user.name });
    }

    return () => {
      socket.off("Connected-Users", handleUsers);
      socket.off("userLeft", handleUserLeft);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
    };
  }, [socket, user, meetingId]);

  const getCameraVideoTrack = () => {
    return streamRef.current?.getVideoTracks()[0];
  };
  const getAudioTrack = () => {
    return streamRef.current?.getAudioTracks()[0];
  };

  const toggleVideo = () => {
    const videoTrack = getCameraVideoTrack();
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
  };

  const toggleAudio = () => {
    const audioTrack = getAudioTrack();
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
  };

  const endCall = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    Object.keys(peersRef.current).forEach((id) => removePeer(id));
  };

  const replaceVideoTrack = async (newTrack: MediaStreamTrack) => {
    const pcs = Object.values(peersRef.current);
    for (const pc of pcs) {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(newTrack);
    }
  };

  const screenshare = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, max: 60 },
      },
      audio: false,
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    if (!screenTrack) return;

    await replaceVideoTrack(screenTrack);
    isScreenSharingRef.current = true;

    screenTrack.onended = async () => {
      const cameraTrack = streamRef.current?.getVideoTracks()[0];
      if (cameraTrack) await replaceVideoTrack(cameraTrack);
      isScreenSharingRef.current = false;
      screenStream.getTracks().forEach((t) => t.stop());
    };
  };

  const startCall = () => {
    if (!socket) return;
    const others = participants.filter(
      (p) => p.socketId && p.socketId !== socket.id,
    );
    others.forEach((p) => makeOffer(p.socketId!));
  };

  const getNameBySocketId = (id: string) => {
    return participants.find((p) => p.socketId === id)?.name || "Remote";
  };

  const remoteTiles = remoteStreams.map((streamItem) => ({
    id: streamItem.socketId,
    label: getNameBySocketId(streamItem.socketId),
    isLocal: false,
    stream: streamItem.stream,
  }));

  const mainTiles =
    remoteTiles.length > 0
      ? remoteTiles
      : [
          {
            id: "waiting-remote",
            label: "Waiting",
            isLocal: false,
            stream: null,
          },
        ];

  const localTile = {
    id: "local-user",
    label: "You",
    isLocal: true,
    stream: null,
  };

  const visibleMainTiles = mainTiles.slice(0, 2);
  const emptySlots = Math.max(0, 2 - remoteTiles.length);

  const renderRemoteTile = (tile: {
    id: string;
    label: string;
    stream: MediaStream | null;
  }) => {
    if (!tile.stream) {
      return (
        <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-dashed border-white/10 bg-white/[0.04]">
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/55">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl">
              ...
            </div>
            <div>
              <p className="text-sm font-semibold text-white/70">
                Waiting for others
              </p>
              <p className="text-xs">Remote videos will appear here</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(21,30,48,0.92),rgba(7,11,19,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,187,120,0.16),transparent_35%)] opacity-80" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
          <div className="rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {tile.label}
          </div>
        </div>
        <video
          ref={(el) => {
            if (el && el.srcObject !== tile.stream) {
              el.srcObject = tile.stream;
            }
          }}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      </div>
    );
  };

  const localPreview = (
    <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,rgba(21,30,48,0.95),rgba(7,11,19,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,187,120,0.16),transparent_35%)] opacity-80" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
        <div className="rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {localTile.label}
        </div>
        <div className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur">
          Camera
        </div>
      </div>
      <video
        ref={localVideoRef}
        className="h-full w-full object-cover scale-x-[-1]"
        autoPlay
        muted
        playsInline
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
    </div>
  );
  return (
    <>
      <div className="h-full bg-[#0b0f19] text-white">
        <div className="relative h-full min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1c2333_0%,#0b0f19_55%,#090c14_100%)]" />

          <div className="relative flex flex-col h-full min-h-full">

            <div className="flex-1 w-full h-full overflow-hidden">
              <div className="h-full px-3 pb-32 pt-20 sm:px-6 sm:pb-24 sm:pt-16">
                <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3 sm:gap-4">
                  {remoteTiles.length <= 1 && (
                    <div className="relative min-h-0 flex-1">
                      <div className="h-full min-h-[260px] sm:min-h-[320px]">
                        {renderRemoteTile(visibleMainTiles[0])}
                      </div>
                      <div className="absolute bottom-3 right-3 z-20 h-20 w-28 sm:bottom-5 sm:right-5 sm:h-28 sm:w-48">
                        {localPreview}
                      </div>
                    </div>
                  )}

                  {remoteTiles.length === 2 && (
                    <>
                      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                        {visibleMainTiles.map((tile) => (
                            <div key={tile.id} className="h-full min-h-[220px] sm:min-h-[280px]">
                            {renderRemoteTile(tile)}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <div className="h-20 w-28 sm:h-24 sm:w-40">{localPreview}</div>
                      </div>
                    </>
                  )}

                  {remoteTiles.length >= 1 && emptySlots > 0 && (
                    <div className="hidden">
                      {Array.from({ length: emptySlots }).map((_, idx) => (
                        <span key={`empty-slot-${idx}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 w-full border-t border-white/10 bg-black/60 backdrop-blur-xl">
              <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
                <button
                  onClick={startCall}
                  aria-label="Start call"
                  className="rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 sm:px-6 sm:text-sm"
                >
                  Start Call
                </button>
                <button
                  onClick={toggleAudio}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-5 sm:text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v1a7 7 0 01-14 0v-1" />
                    <path d="M12 19v4" />
                    <path d="M8 23h8" />
                  </svg>
                  Mute
                </button>
                <button
                  onClick={screenshare}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-5 sm:text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M7 20h10" />
                    <path d="M12 16v4" />
                  </svg>
                  Share Screen
                </button>
                <button
                  onClick={toggleVideo}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-5 sm:text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="7" width="13" height="10" rx="2" />
                    <path d="M16 9l5-2v10l-5-2V9z" />
                  </svg>
                  Cut Video
                </button>
                <button
                  onClick={endCall}
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 sm:px-6 sm:text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12c-2.3 0-4.5.5-6.5 1.5l-2-2a11 11 0 00-5 0l-2 2C4.5 12.5 2.3 12 0 12" />
                    <path d="M6 16l2-2" />
                    <path d="M16 14l2 2" />
                  </svg>
                  End Call
                </button>
                <button
                  onClick={leaveRoom}
                  type="button"
                  className="rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-5 sm:text-sm"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCall;



