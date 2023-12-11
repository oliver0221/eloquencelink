import React, { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { Assistant, AssistantList, EditAssistant } from "@/types";

interface AssistantProps {
  aiId: string;
  userId: string;
  aiName: string;
  command: string;
  creativity: string;
  contextCount: string;
  replyLength: string;
}

type Props = {
  value: string;
  loading?: boolean;
  onChange: (value: Assistant) => void;
};

const transList = (props: AssistantProps[]): EditAssistant[] => {
  const data: EditAssistant[] = props.map((item) => {
    const data: EditAssistant = {
      id: item.aiId !== "0" ? item.aiId : undefined,
      name: item.aiName,
      prompt: item.command,
      temperature: item.creativity ? parseFloat(item.creativity) : undefined,
      max_log: item.contextCount
        ? parseInt(item.contextCount, 10)
        : undefined!,
      max_tokens: item.replyLength
        ? parseInt(item.replyLength, 10)
        : undefined!,
    };
    return data;
  });
  return data;
};
const fetchAssistantList = async () => {
  const result = await fetch(
    `http://127.0.0.1:80/admin/ai/getAIAssistanceById?userId=${localStorage.getItem(
      "id"
    )}`,
    {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(async (response) => await response.json());
  console.log(result);

  return result.data;
};

export const AssistantSelect = ({
  value,
  loading = false,
  onChange,
}: Props) => {
  const [list, setList] = useState<AssistantList>([]);
  const [currentAssistant, setCurrentAssistant] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchList = async (): Promise<void> => {
      const store = await fetchAssistantList();
      const assistantList = transList(store) as AssistantList;
      setList(assistantList);

      const existingAssistant = assistantList.find((assistant) => assistant.id === value);
      const firstAssistantId = assistantList[0]?.id;
      setCurrentAssistant(existingAssistant ? existingAssistant.id : firstAssistantId);
      if (!existingAssistant && assistantList.length > 0) {
        onChange(assistantList[0]);
      }
    };
    fetchList();
  }, [value, onChange]);


  const onAssistantChange = (selectedValue: string) => {
    const assistant = list.find((item) => item.id === selectedValue);
    if (assistant) {
      setCurrentAssistant(selectedValue);
      onChange(assistant);
    }
  };




  return (
    <Select
      size="sm"
      onChange={onAssistantChange}
      value={currentAssistant}
      className="w-64 mx-2"
      disabled={loading}
      data={list.map((item) => ({
        value: item.id,
        label: item.name,
      }))}
      styles={(theme) => ({
        input: {
          borderColor: theme.colors.orange[6],
          '&:focus': {
            borderColor: theme.colors.orange[6],
            boxShadow: `0 0 0 1px ${theme.colors.orange[6]}`,
          },
        },
        item: {
          '&[data-hovered]': {
            backgroundColor: theme.colors.orange[0],
          },
          '&[data-selected]': {
            backgroundColor: theme.colors.orange[6],
            color: theme.white,
          },
          '&[data-selected][data-hovered]': {
            backgroundColor: theme.colors.orange[6],
          },
        },
      })}
    />






  );
};
