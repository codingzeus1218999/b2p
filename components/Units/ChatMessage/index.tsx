"use client";

import { useUser } from "@/context/UserContext";
import { ChatMessageProps } from "@/interfaces";
import moment from "moment";
import React from "react";

const ChatMessage: React.FC<ChatMessageProps> = ({ msg }) => {
  const { user } = useUser();
  return (
    <>
      {msg.author_id === user.id && (
        <div className="flex flex-col am-gapY-2px items-end">
          <div
            className="max-w-410px px-4 py-3 bg-blue-400 text-sm rounded-2xl rounded-br-none"
            style={{ overflowWrap: "anywhere" }}
          >
            {msg.message}
          </div>
          <p className="text-zinc-200 text-xs leading-6">
            {moment(msg.created_at).format("DD.MM.YYYY, HH:mm")}
          </p>
        </div>
      )}
      {msg.author_id !== user.id && (
        <div className="flex am-gapX-12px items-end">
          <img
            width={40}
            height={40}
            alt={msg.author_name}
            src={msg.author_image?.path ?? "/images/no_img.png"}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col am-gapY-2px">
            <p className="text-sm leading-6">{msg.author_name}</p>
            <div
              className="max-w-410px px-4 py-3 bg-sky-50 text-sm rounded-2xl rounded-bl-none"
              style={{ overflowWrap: "anywhere" }}
            >
              {msg.message}
            </div>
            <p className="text-zinc-200 text-xs leading-6">
              {moment(msg.created_at).format("DD.MM.YYYY, HH:mm")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
