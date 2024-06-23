// useSocket.js
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const useSocket = (url = "http://localhost:4000") => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(url);
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [url]);

  return socketRef.current;
};

export default useSocket;
