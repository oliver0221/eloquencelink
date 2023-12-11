import React, { useEffect, useState } from "react";
import * as chatStorage from "@/utils/chatStorage";
import { Message } from "@/components/Message";
import { Session } from "../Session";
import { MediaQuery } from "@mantine/core";
import internal from "stream";

export const Chat = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const [role, setRole] = useState<string>('1');

  useEffect(() => {
    const init = () => {
      const list = chatStorage.getSessionStore();
      const id = list[0].id;
      setSessionId(id);

      setRole(Number.parseInt(localStorage.getItem("userStatus") || "1").toString());

      
    };
    init();
  }, []);

  return (
    <div className="h-screen flex w-screen">
      <MediaQuery
        smallerThan="md"
        styles={{
          width: "0 !important",
          padding: "0 !important",
          overflow: "hidden",
        }}
      >
        <Session sessionId={sessionId} onChange={setSessionId} userStatus={role}></Session>
      </MediaQuery>
      <Message sessionId={sessionId} userStatus={role}></Message>
    </div>
  );
};
