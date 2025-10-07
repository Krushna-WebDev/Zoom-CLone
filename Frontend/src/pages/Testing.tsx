import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const Testing = () => {
  const [input, setinput] = useState<string>("");
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [msgs, setMsgs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("send_msg", input);
    setinput("");
  };

  useEffect(() => {
    socket.on("connect", () => { 
      console.log("conneted");
    });
    socket.on("received_msg", (msg) => {
      setMsgs((prev) => [...prev, msg]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div className="min-h-screen mx-auto text-center">
        <h1>Testing form</h1>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setinput(e.target.value)}
            className="border px-2 py-1"
            placeholder="Enter MSG"
          />
          <button className="bg-blue-500 px-2 py-1 rounded text-white font-semibold ">
            Submit
          </button>
        </form>
        <div className="mt-4">
          <h2>Messages:</h2>
          {msgs.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Testing;
