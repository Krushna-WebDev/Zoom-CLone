import React, { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../../Context/SocketContext";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  //context
  const socket = useContext(SocketContext);
  const { meetingId } = useParams();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const isScreenSharingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const setupVideo = async () => {
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

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
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => {
        console.log("added track",track)
        pcRef.current?.addTrack(track, stream);
      });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      //pcRef.current.onicecandidate
    };
    setupVideo();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("ice-candidate", async ({ candidate }: any) => {
      if (!candidate) return;
      console.log("candidates", candidate);

      try {
        await pcRef.current?.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });
  }, [socket]);

  const sendOffer = async () => {
    if (!socket) return;
    if (!pcRef.current) {
      console.warn("PeerConnection is not initialized yet.");
      return;
    }
    const offer = await pcRef.current.createOffer();
    console.log("offer created", offer);
    await pcRef.current?.setLocalDescription(offer);
    socket.emit("offer", { offer, meetingId });
  };
  const getCameraVideoTrack = () => {
    return streamRef.current?.getVideoTracks()[0];
  };
  const toggleVideo = () => {
    const videoTrack = getCameraVideoTrack();
    console.log("video track",videoTrack)
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
  };

  const screenshare = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    if (!screenTrack || !pcRef.current) return;

    const sender = pcRef.current
      .getSenders()
      .find((s) => s.track?.kind === "video");

    if (!sender) {
      console.warn("No video sender found");
      return;
    }

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
        console.log("offer mila:", offer);

        if (!pcRef.current) {
          console.warn("PC not ready yet, skipping offer");
          return;
        }

        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit("answer", { answer, meetingId });
        console.log("ans created", answer);
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("answer", async (answer) => {
      console.log("answer mila", answer);
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    return () => {
      socket.off("answer");
    };
  }, [socket]);
  return (
    <>
      <div className=" flex flex-col bg-black">
        <div className="flex-1 relative bg-black">
          <video
            ref={remoteVideoRef}
            className="object-cover"
            autoPlay
            playsInline
          />

          {/* Local video - floating corner */}
          <div className="absolute bottom-4 right-4 w-48 h-40 bg-black rounded-lg overflow-hidden border-2 border-gray-600">
            <h1 className="text-white p-1">You</h1>
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          </div>
        </div>

        {/* Controls - bottom bar */}
        <div className="bg-gray-900 border-t border-gray-700 p-4 flex items-center justify-center gap-4">
          <button
            onClick={sendOffer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Start Call
          </button>
          <button
            onClick={screenshare}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Share Screen
          </button>
          <button
            onClick={toggleVideo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Cut Video
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
