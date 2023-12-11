import type { AssistantList, EditAssistant } from "@/types";
import assistantStore from "@/utils/assistantStore";
import { ASSISTANT_INIT } from "@/utils/constant";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { AssistantConfig } from "@/components/AssistantConfig";
import Link from "next/link";
import { ActionIcon, Card, Text, Group, Drawer, Badge, Loader, Button, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconUserPlus, IconPencil } from "@tabler/icons-react";
import React, { useEffect, useState, useCallback } from "react";

const showNotification = (message: string, color: "green" | "red" = "green") => {
  notifications.show({
    id: "notification",
    title: color === "green" ? "Success" : "Error",
    message,
    color,
    autoClose: 3000,
  });
};

interface AssistantProps {
  aiId: string,
  userId: string,
  aiName: string,
  command: string,
  creativity: string,
  contextCount: string,
  replyLength: string
}

const Assistant: NextPage = () => {
  const [assistantList, setAssistantList] = useState<AssistantList>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editAssistant, setEditAssistant] = useState<EditAssistant>();
  const [opened, drawerHandler] = useDisclosure(false);

  const trans = useCallback((data: EditAssistant): AssistantProps => {
    return {
      aiId: data.id || "0",
      userId: localStorage.getItem("id") || "0",
      aiName: data.name || "",
      command: data.prompt || "",
      creativity: data.temperature?.toString() || "0",
      contextCount: data.max_log?.toString() || "0",
      replyLength: data.max_tokens?.toString() || "0",
    };
  }, []);

  const transList = useCallback((props: AssistantProps[]): EditAssistant[] => {
    return props.map((item) => ({
      id: item.aiId !== "0" ? item.aiId : undefined,
      name: item.aiName,
      prompt: item.command,
      temperature: item.creativity ? parseFloat(item.creativity) : undefined,
      max_log: item.contextCount ? parseInt(item.contextCount, 10) : undefined!,
      max_tokens: item.replyLength ? parseInt(item.replyLength, 10) : undefined!,
    }));
  }, []);

  const fetchAssistantList = useCallback(async () => {
    try {
      const result = await fetch(`http://127.0.0.1:80/admin/ai/getAIAssistanceById?userId=${localStorage.getItem("id")}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!result.ok) throw new Error("Network response was not ok");
      const data = await result.json();
      const assistants = transList(data.data);
      setAssistantList(assistants as AssistantList);
      setIsDataLoaded(true);
      showNotification("Assistant list fetched successfully");
    } catch (error) {
      console.error('Fetching assistant list failed:', error);
      setIsDataLoaded(true);
      showNotification("Failed to fetch assistant list", "red");
    }
  }, [transList]);

  useEffect(() => {
    fetchAssistantList();
  }, [fetchAssistantList]);

  const saveAssistant = async (data: EditAssistant) => {
    try {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? 'updateAIAssistance' : 'addAIAssistance';
      const response = await fetch(`http://127.0.0.1:80/admin/ai/${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trans(data))
      });
      if (!response.ok) throw new Error("Network response was not ok");
      await fetchAssistantList();
      showNotification(`${data.id ? "Updated" : "Added"} successfully`);
    } catch (error) {
      console.error('Saving assistant failed:', error);
      showNotification("Failed to save assistant", "red");
    } finally {
      drawerHandler.close();
    }
  };

  const removeAssistant = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:80/admin/ai/deleteAIAssistance/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await fetchAssistantList();
      showNotification("Removed successfully");
    } catch (error) {
      console.error('Deleting AI failed:', error);
      showNotification("Failed to remove assistant", "red");
    } finally {
      drawerHandler.close();
    }
  };


  const onEditAssistant = (data: EditAssistant) => {
    setEditAssistant(data);
    drawerHandler.open();
  };

  const onAddAssistant = () => {
    const newAssistant = { ...ASSISTANT_INIT[0], name: `Assistant NO. ${assistantList.length + 1}` };
    setEditAssistant(newAssistant);
    drawerHandler.open();
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/AIbackground.png)',
        backgroundSize: 'cover',
        opacity: 1,
      }}
    >
      <div className="flex justify-between p-4 shadow-sm bg-orange-400 text-white">
        <Link href="/chat">
          <Button
            variant="filled"
            color="orange"
            size="sm"
            radius="xl"
            leftIcon={<IconChevronLeft size={20} />}
          >
            Back
          </Button>
        </Link>

        <Text weight={700} size="lg" style={{ color: 'white' }}>
          Assistant
        </Text>

        <Tooltip label="Add Custom AI" position="bottom" withArrow>
          <Button
            variant="filled"
            color="orange"
            size="sm"
            radius="xl"
            leftIcon={<IconUserPlus size={20} />}
            onClick={() => onAddAssistant()}
          >
            Add AI
          </Button>
        </Tooltip>
      </div>


      <div className="flex gap-8 flex-wrap p-4 overflow-y-auto">
        {isDataLoaded && assistantList.map((item) => (
          <Card
            key={item.id}
            shadow="sm"
            padding="lg"
            radius="md"
            className="w-full max-w-sm group transition-all duration-300 bg-orange-100 hover:bg-orange-200"
          >
            <Text weight={500} className="line-clamp-1 text-orange-800">
              {item.name}
            </Text>
            <Text size="sm" color="dimmed" className="line-clamp-3 mt-2 text-orange-600">
              {item.prompt}
            </Text>
            <Group className="mt-4 flex items-center">
              <Group>
                <Badge size="md" color="orange" variant="filled" radius="sm">
                  TOKEN: {item.max_tokens}
                </Badge>
                <Badge size="md" color="yellow" variant="filled" radius="sm">
                  TEMP: {item.temperature}
                </Badge>
                <Badge size="md" color="amber" variant="filled" radius="sm">
                  LOGS: {item.max_log}
                </Badge>
              </Group>
              <Group className="w-full flex justify-end items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <ActionIcon size="sm" color="orange" onClick={() => onEditAssistant(item)}>
                  <IconPencil />
                </ActionIcon>
              </Group>
            </Group>
          </Card>

        ))}
      </div>
      <Drawer
        opened={opened}
        onClose={drawerHandler.close}
        size="lg"
        position="right"
      >
        <AssistantConfig
          assistant={editAssistant!}
          save={saveAssistant}
          remove={removeAssistant}
        />
      </Drawer>
    </div>

  );
};

export default Assistant;
