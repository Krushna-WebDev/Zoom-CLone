import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../../Context/SocketContext";
import { UserContext } from "../../../Context/Context";
import { useParams } from "react-router-dom";

// simple 4-person mesh (max 4 including you)
const VideoCall = () => {
  const socket = useContext(SocketContext);
  const { user } = useContext(UserContext)!;
  const { meetingId } = useParams();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isScreenSharingRef = useRef(false);

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

  // make sure video page also joins the room
  useEffect(() => {
    if (!socket || !user || !meetingId) return;
    socket.emit("join-room", { meetingId, name: user.name });

    return () => {
      socket.emit("leave-room", meetingId);
    };
  }, [socket, user, meetingId]);

  const upsertRemoteStream = (socketId: string, stream: MediaStream) => {
    setRemoteStreams((prev) => {
      const idx = prev.findIndex((p) => p.socketId === socketId);
      if (idx === -1) return [...prev, { socketId, stream }];
      const copy = [...prev];
      copy[idx] = { socketId, stream };
      return copy;
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
      if (state === "failed" || state === "closed" || state === "disconnected") {
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

  const syncPeers = (users: any[]) => {
    if (!socket || !isReady) return;
    const myId = socket.id;
    const others = users.filter((u) => u.socketId && u.socketId !== myId);
    const otherIds = new Set(others.map((u) => u.socketId));

    Object.keys(peersRef.current).forEach((id) => {
      if (!otherIds.has(id)) removePeer(id);
    });

    others.forEach((u) => {
      createPeer(u.socketId);
      if (myId && myId > u.socketId && !offeredRef.current[u.socketId]) {
        makeOffer(u.socketId);
      }
    });
  };

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

    return () => {
      socket.off("Connected-Users", handleUsers);
      socket.off("userLeft", handleUserLeft);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
    };
  }, [socket, isReady]);

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

  return (
    <>
      <div className="h-full bg-[#0b0f19] text-white">
        <div className="relative h-full min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1c2333_0%,#0b0f19_55%,#090c14_100%)]" />

          <div className="relative flex flex-col h-full min-h-full">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-6">
              <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                Live
              </div>
              <div className="pointer-events-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                Room: {meetingId} • {participants.length} participant
                {participants.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="flex-1 w-full h-full overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-24 pt-16 h-full">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                  <div className="absolute top-3 left-3 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
                    You
                  </div>
                  <video
                    ref={localVideoRef}
                    className="w-full h-full object-cover scale-x-[-1]"
                    autoPlay
                    muted
                    playsInline
                  />
                </div>

                {remoteStreams.map((r) => (
                  <div
                    key={r.socketId}
                    className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl"
                  >
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {getNameBySocketId(r.socketId)}
                    </div>
                    <video
                      ref={(el) => {
                        if (el && el.srcObject !== r.stream) {
                          el.srcObject = r.stream;
                        }
                      }}
                      className="w-full h-full object-contain"
                      autoPlay
                      playsInline
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 w-full bg-black/50 backdrop-blur-xl border-t border-white/10">
              <div className="mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startCall}
                  className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                >
                  Start Call
                </button>
                <button
                  onClick={toggleAudio}
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
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
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
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
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
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
                  className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition inline-flex items-center gap-2"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
