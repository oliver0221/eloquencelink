// Importing necessary React hooks and other components
import { useEffect, useState, KeyboardEvent } from "react";
import chatService from "@/utils/chatService";
import { Markdown } from "../Markdown";
import { ActionIcon, Loader, Textarea, useMantineColorScheme, Button, Popover, Flex } from "@mantine/core";
import Link from "next/link";
import * as chatStorage from "@/utils/chatStorage";
import { ThemeSwitch } from "../ThemeSwitch";
import { USERMAP } from "@/utils/constant";
import { AssistantSelect } from "../AssistantSelect";
import { IconSend, IconSendOff, IconEraser, IconDotsVertical } from "@tabler/icons-react";
import { Assistant, MessageList } from "@/types";
import clsx from "clsx";

// Type definition for the component's props
type Props = {
  sessionId: string;
  userStatus?: string;
};

// The main message component
export const Message = ({ sessionId }: Props) => {
  // State hooks for various purposes
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageList>([]);
  const [assistant, setAssistant] = useState<Assistant>();
  const [userStatus, setUserStatus] = useState<string>("1");
  const { colorScheme } = useMantineColorScheme();

  // Function to update the messages
  const updateMessage = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  // Setting up actions for the chat service
  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: () => {
      setLoading(false);
    },
  };

  // Fetching data when the sessionId changes
  useEffect(() => {
    const session = chatStorage.getSession(sessionId);
    setAssistant(session?.assistant);
    const msg = chatStorage.getMessage(sessionId);
    setMessage(msg);
    if (loading) {
      chatService.cancel();
    }
  }, [sessionId]);

  // Fetching user status from local storage
  useEffect(() => {
    setUserStatus(localStorage.getItem("userStatus") || "1");
  }, []);

  // Handler for changing the assistant
  const onAssistantChange = (assistant: Assistant) => {
    setAssistant(assistant);
    chatStorage.updateSession(sessionId, { assistant: assistant.id });
  };

  // Handler for clearing the messages
  const onClear = () => {
    updateMessage([]);
  };

  // Handler for key down event in the text area
  const onKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      onSubmit();
    }
  };

  // Function to set the suggestion
  const setSuggestion = (suggestion: string) => {
    if (suggestion === "") return;
    const len = message.length;
    const lastMessage = len ? message[len - 1] : null;
    let newList: MessageList = [];
    if (lastMessage?.role === "assistant") {
      newList = [...message.slice(0, len - 1), { ...lastMessage, content: suggestion }];
    } else {
      newList = [...message, { role: "assistant", content: suggestion }];
    }
    setMessages(newList);
  };

  // Function to set the messages
  const setMessages = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  // Handler for the submit button
  const onSubmit = () => {
    if (loading) {
      return chatService.cancel();
    }
    if (!prompt.trim()) return;
    let list: MessageList = [...message, { role: "user", content: prompt }];
    setMessages(list);
    setLoading(true);
    chatService.getStream({
      prompt,
      options: assistant,
      history: list.slice(-assistant?.max_log!),
    });
    setPrompt("");
  };

  // Rendering the component
  return (
    <div
      className="flex flex-col h-screen w-full relative"
      style={{
        overflow: 'hidden',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/chatbackground.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: -1,
        }}
      />
      <div className="flex flex-col h-screen w-full">
        {userStatus !== "1" ? (
          // If userStatus is not "1", show assistant and theme switch
          <div className="flex justify-between items-center p-4 shadow-sm h-[6rem]">
            <Popover width={200} position="bottom" withArrow shadow="sm">
              <Popover.Target>
                <Button
                  size="sm"
                  variant="subtle"
                  className="px-1 text-orange-600"
                  rightIcon={<IconDotsVertical size="1rem" className="text-orange-600" />}
                >
                  AI Assistant
                </Button>
              </Popover.Target>
              <Popover.Dropdown className="flex items-center justify-center text-center">
                <Link href="/assistant" className="no-underline text-orange-600 text-xs">
                  Assistant Management
                </Link>
              </Popover.Dropdown>
            </Popover>
            <AssistantSelect value={assistant?.id!} onChange={onAssistantChange}></AssistantSelect>
            <ThemeSwitch></ThemeSwitch>
          </div>
        ) : (
          // Else, render an empty div
          <div className={clsx(["flex", "justify-center", "items-center", "p-4", "shadow-sm", "h-[6rem]"])}>
            <AssistantSelect value={assistant?.id!} onChange={onAssistantChange}></AssistantSelect>
          </div>
        )}
        <div className={clsx(["flex-col", "h-[calc(100vh-10rem)]", "w-full", "overflow-y-auto", "rounded-sm", "px-8"])}>
          {message.map((item, idx) => {
            const isUser = item.role === "user";
            return (
              <div
                key={`${item.role}-${idx}`}
                className={clsx({ flex: item.role === "user", "flex-col": item.role === "user", "items-end": item.role === "user" }, "mt-4")}
              >
                <div>
                  {USERMAP[item.role]}
                  {!isUser && idx === message.length - 1 && loading && <Loader size="sm" variant="dots" className="ml-2" />}
                </div>
                <div
                  className={clsx(
                    {
                      "bg-blue-300": colorScheme === "light" && isUser,
                      "bg-orange-400": colorScheme === "light" && !isUser,
                      "bg-zinc-700/40": colorScheme === "dark",
                      "whitespace-break-spaces": isUser,
                    },
                    "rounded-md",
                    "shadow-md",
                    "px-4",
                    "py-2",
                    "mt-1",
                    "w-full",
                    "max-w-4xl",
                    "min-h-[3rem]"
                  )}
                >
                  {isUser ? <div>{item.content}</div> : <Markdown markdownText={item.content}></Markdown>}
                </div>
              </div>
            );
          })}
        </div>
        <div className={clsx("flex", "items-center", "justify-center", "self-end", "my-4", "w-full")}>
          <Button
            variant="outline"
            color="orange"
            className="mr-2"
            disabled={loading}
            onClick={() => onClear()}
          >
            <IconEraser size={14} />
            Clear Chat
          </Button>
          <Textarea placeholder="Enter Send Message; Shift + Enter for New Line" className="w-3/5" value={prompt} disabled={loading} onKeyDown={(evt) => onKeyDown(evt)} onChange={(evt) => setPrompt(evt.target.value)}></Textarea>
          <Button
            color="orange"
            className="ml-2"
            disabled={loading}
            onClick={() => onSubmit()}
          >
            {loading ? <IconSendOff size={14} /> : <IconSend size={14} />}
            Send
          </Button>
        </div>
      </div>
    </div>

  );
};
