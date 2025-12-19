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

  console.log("pc", pcRef.current);
  return (
    <>
      <h2>Local Preview</h2>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "300px", background: "#000" }}
      />
      <h2>remote video</h2>
      <video
        ref={remoteVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "300px", background: "#000" }}
      />
      <button
        onClick={sendOffer}
        className="bg-blue-600 shadow-md rounded py-2 px-2 text-white font-semibold font-rail
      "
      >
        Start Call
      </button>
      <button
        onClick={screenshare}
        className="bg-blue-600 shadow-md rounded py-2 px-2 text-white font-semibold font-rail
      "
      >
        share Screen
      </button>
    </>
  );
};

export default VideoCall;
