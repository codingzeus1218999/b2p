"use client";

import { LeftIcon, PinIcon } from "@/components/Icons";
import { ChatMessage, Spinner } from "@/components/Units";
import {
  ChatHistoryProps,
  chatInterface,
  messageInterface,
} from "@/interfaces";
import ImgNoImg from "@/public/images/no_img.png";
import { getChatInfo, getMessages, sendMessage } from "@/services/messagesApi";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ChatInput from "../ChatInput";

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatId, onClickBack }) => {
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [msgs, setMsgs] = useState<messageInterface[]>([]);
  const [chatInfo, setChatInfo] = useState<chatInterface | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesEndMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) getInitData();
  }, [chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (messagesEndMobileRef.current) {
      messagesEndMobileRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  const getInitData = async () => {
    setInitLoading(true);
    try {
      const ms = await getMessages(chatId);
      const ci = await getChatInfo(chatId);
      setMsgs(ms.data);
      setChatInfo(ci);
    } catch (err) {
      console.log("Error get init messages", err);
    } finally {
      setInitLoading(false);
    }
  };

  const onSendMsg = async (val: string) => {
    if (!chatId || !val) return;
    try {
      const res = await sendMessage(chatId, val);
      setMsgs([...msgs, res]);
    } catch (err) {
      console.log("Error sending message", err);
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <p className="p-4 text-right text-2xl font-semibold">
          {chatInfo?.title ?? ""}
        </p>
        <div className="p-4 shadow-custom-1 rounded-lg">
          {initLoading && (
            <div className="h-calc-2 flex items-center justify-center">
              <Spinner size={26} color="blue" innerColor="white" />
            </div>
          )}
          {!initLoading && (
            <div className="flex flex-col am-gapY-16px h-calc-2 scroll-hide">
              {msgs.map((m, _idx) => (
                <ChatMessage key={_idx} msg={m} />
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          )}
          <div
            className="h-px w-full bg-sky-50"
            style={{ marginTop: "23px" }}
          ></div>
          <div className="mt-4">
            <ChatInput onSend={onSendMsg} />
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <div className="p-3 flex items-center justify-between">
          <LeftIcon className="cursor-pointer" onClick={onClickBack} />
          <Image
            width={40}
            height={40}
            alt={chatInfo?.author_id ?? ""}
            src={ImgNoImg}
            className="w-10 h-10 rounded-full ml-2"
          />
          <div className="flex-1 w-calc-1">
            <p className="text-sm leading-4">{chatInfo?.title ?? ""}</p>
            <p className="text-xs leading-4 text-neutral-400 overflow-hidden text-ellipsis">
              {chatInfo?.last_message ?? ""}
            </p>
          </div>
          <PinIcon className="cursor-pointer" />
        </div>
        <div className="p-4 rounded-lg shadow-custom-1">
          {initLoading && (
            <div className="h-calc-4 flex items-center justify-center">
              <Spinner size={26} color="blue" innerColor="white" />
            </div>
          )}
          {!initLoading && (
            <div className="flex flex-col am-gapY-16px h-calc-4 scroll-hide">
              {msgs.map((m, _idx) => (
                <ChatMessage key={_idx} msg={m} />
              ))}
              <div ref={messagesEndMobileRef}></div>
            </div>
          )}
          <div className="h-px w-full bg-sky-50 mt-4"></div>
          <div className="mt-22px">
            <ChatInput onSend={onSendMsg} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
