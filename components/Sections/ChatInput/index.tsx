"use client";

import { SendIcon } from "@/components/Icons";
import { ChatInputProps } from "@/interfaces";
import { ChangeEvent, KeyboardEvent, useState } from "react";

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value.slice(0, 256));
  };

  const handleClick = () => {
    handleSendMessage();
  };

  return (
    <div className="flex items-center border rounded-100px pl-4 pr-2 h-10 border-indigo-300">
      <input
        type="text"
        className="flex-grow outline-none text-sm min-w-1"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <SendIcon className="cursor-pointer" onClick={handleClick} />
    </div>
  );
};

export default ChatInput;
