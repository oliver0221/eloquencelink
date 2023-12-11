import type { Session as ISession, SessionList } from "@/types";
import * as chatStorage from "@/utils/chatStorage";
import React, { useEffect, useState } from "react";
import { IconTrash, IconMessagePlus } from "@tabler/icons-react";
import { EditableText } from "../EditableText";
import assistantStore from "@/utils/assistantStore";
import { useMantineColorScheme, ActionIcon } from "@mantine/core";
import QRCode from 'qrcode.react';
import { Modal, Button } from '@mantine/core';
import clsx from "clsx";
type Props = {
  sessionId: string;
  onChange: (arg: string) => void;
  className?: string;
  userStatus?: string;
};

const itemBaseClasses =
  "flex cursor-pointer h-[2.4rem] items-center justify-around group px-4 rounded-md";

const generateItemClasses = (
  id: string,
  sessionId: string,
  colorScheme: string,
) => {
  return clsx([
    itemBaseClasses,
    {
      "hover:bg-gray-300/60": colorScheme === "light",
      "bg-gray-200/60": id !== sessionId && colorScheme === "light",
      "bg-gray-300": id === sessionId && colorScheme === "light",
      "hover:bg-zinc-800/50": colorScheme === "dark",
      "bg-zinc-800/20": id !== sessionId && colorScheme === "dark",
      "bg-zinc-800/90": id === sessionId && colorScheme === "dark",
    },
  ]);
};

export const Session = ({ sessionId, onChange, className, userStatus }: Props) => {
  const [sessionList, setSessionList] = useState<SessionList>([]);
  const { colorScheme } = useMantineColorScheme();
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const list = chatStorage.getSessionStore();
    setSessionList(list);
  }, []);

  const createSession = () => {
    const assistantList = assistantStore.getList();
    const newSession: ISession = {
      name: `session-${sessionList.length + 1}`,
      assistant: assistantList[0].id,
      id: Date.now().toString(),
    };
    onChange(newSession.id);
    let list = chatStorage.addSession(newSession);
    setSessionList(list);
  };
  const removeSession = (id: string) => {
    let list = chatStorage.removeSession(id);
    if (sessionId === id) {
      onChange(list[0].id);
    }
    setSessionList(list);
  };
  const updateSession = (name: string) => {
    let newSessionList = chatStorage.updateSession(sessionId, {
      name,
    });
    setSessionList(newSessionList);
  };

  const handleLogout = () => {
    window.location.href = '/'; //Redirecting to the login page.
  };

  return (
    <div
      className={clsx(
        {
          /*  "bg-black/10": colorScheme === "dark",
           "bg-gray-100": colorScheme === "light", */

          "bg-white/10": colorScheme === "dark",
          "bg-orange-200": colorScheme === "light",
        },
        "h-screen",
        "w-64",
        "flex",
        "flex-col",
        "px-2",
        className,
      )}
    >
      <div className="flex justify-center py-2 w-full">
        {userStatus !== "1" ? (
          <Button
            onClick={() => createSession()}
            size="md"
            color="orange"
            leftIcon={<IconMessagePlus size="1rem" />}
          >
            Start Session
          </Button>

        ) : (
          <div />
        )}
      </div>

      <div
        className={clsx([
          "pb-4",
          "overflow-y-auto",
          "scrollbar-none",
          "flex",
          "flex-col",
          "gap-y-2",
        ])}
      >
        {sessionList.map(({ id, name }) => (
          <div
            key={id}
            className={generateItemClasses(id, sessionId, colorScheme)}
            onClick={() => onChange(id)}
          >
            <EditableText
              text={name}
              onSave={(name: string) => updateSession(name)}
            ></EditableText>
            {sessionList.length > 1 ? (
              <IconTrash
                size=".8rem"
                color="gray"
                onClick={(evt) => {
                  evt.stopPropagation();
                  removeSession(id);
                }}
                className="mx-1 invisible group-hover:visible"
              ></IconTrash>
            ) : null}
          </div>
        ))}
      </div>
      <Button onClick={() => setModalOpen(true)} style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        margin: '10px',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>Upgrade</Button>

      <Button onClick={handleLogout} style={{
        position: 'fixed',
        left: '110px', // Adjust according to the position of the "Upgrade" button
        bottom: 0,
        margin: '10px',
        padding: '10px 20px',
        backgroundColor: '#FF5733',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>Logout</Button>



      <Modal opened={isModalOpen} onClose={() => setModalOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <QRCode value="Your payment link or information" />
          <p>Please scan the QR code above to complete the upgrade payment</p>
        </div>
      </Modal>
    </div>
  );
};
