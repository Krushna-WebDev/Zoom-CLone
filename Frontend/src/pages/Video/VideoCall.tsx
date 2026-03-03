import React, { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../../Context/SocketContext";
import { useParams } from "react-router-dom";

// TODO :- Offer glare

const VideoCall = () => {
  //context
  const socket = useContext(SocketContext);
  const { meetingId } = useParams();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const isScreenSharingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingICERef = useRef<RTCIceCandidateInit[]>([]);

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
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      if (!pcRef.current) return;

      // this will run when setLocalDescription(offer) set
      pcRef.current.onicecandidate = (event) => {
        if (!socket) return;
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            meetingId,
          });
        }
      };

      pcRef.current.ontrack = (event) => {
        if (!remoteVideoRef.current) return;
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      stream.getTracks().forEach((track) => {
        pcRef.current?.addTrack(track, stream);
      });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    };
    setupVideo();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleIce = async ({ candidate }: any) => {
      if (!candidate || !pcRef.current) return;
      if (!pcRef.current.remoteDescription) {
        pendingICERef.current.push(candidate);
        return;
      }
      await pcRef.current.addIceCandidate(candidate);
    };

    socket.on("ice-candidate", handleIce);

    return () => {
      socket.off("ice-candidate", handleIce);
    };
  }, [socket]);

  const sendOffer = async () => {
    if (!socket) return;
    if (!pcRef.current) {
      console.warn("PeerConnection is not initialized yet.");
      return;
    }
    const offer = await pcRef.current.createOffer();
    await pcRef.current?.setLocalDescription(offer);
    socket.emit("offer", { offer, meetingId });
  };

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
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    pcRef.current?.close();
    pcRef.current = null;
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
    if (!screenTrack || !pcRef.current) return

    const sender = pcRef.current
      .getSenders()
      .find((s) => s.track?.kind === "video");
    if (!sender) {
      console.warn("No video sender found");
      return;
    }
    const params = sender.getParameters();
    params.encodings = [{ maxBitrate: 2_500_000 }];
    await sender.setParameters(params);

    // Replace camera with screen
    await sender.replaceTrack(screenTrack);
    isScreenSharingRef.current = true;

    // Restore camera when user stops sharing
    screenTrack.onended = async () => {
      const cameraTrack = streamRef.current?.getVideoTracks()[0];
      if (cameraTrack) await sender.replaceTrack(cameraTrack);
      isScreenSharingRef.current = false;

      // cleanup
      screenStream.getTracks().forEach((t) => t.stop());
    };
  };

  useEffect(() => {
    try {
      if (!socket) return;
      socket.on("offer", async (offer) => {
        if (!pcRef.current) {
          console.warn("PC not ready yet, skipping offer");
          return;
        }

        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(offer),
        );
        if (pcRef.current.signalingState !== "have-remote-offer") {
          return;
        }
        pendingICERef.current.forEach((c) => pcRef.current?.addIceCandidate(c));
        pendingICERef.current = [];
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit("answer", { answer, meetingId });
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("answer", async (answer) => {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );

      pendingICERef.current.forEach((c) => pcRef.current?.addIceCandidate(c));
      pendingICERef.current = [];
    });
  }, [socket]);
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
                Room: {meetingId}
              </div>
            </div>

            <div className="flex-1 w-full h-full overflow-hidden">
              <div className="flex h-full w-full gap-4 px-6 pb-24 pt-16">
                {/* Remote */}
                <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                  <div className="absolute top-3 left-3 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Remote
                  </div>
                  <video
                    ref={remoteVideoRef}
                    className="w-full h-full object-contain"
                    autoPlay
                    playsInline
                  />
                </div>

                {/* You */}
                <div className="relative w-[28%] min-w-[220px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
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
              </div>
            </div>

            <div className="sticky bottom-0 w-full bg-black/50 backdrop-blur-xl border-t border-white/10">
              <div className="mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={sendOffer}
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
