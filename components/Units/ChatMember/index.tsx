"use client";

import { ChatMemberProps } from "@/interfaces";
import ImgNoImg from "@/public/images/no_img.png";
import moment from "moment";
import Image from "next/image";
import React from "react";
import Skeleton from "../Skeleton";

const ChatMember: React.FC<ChatMemberProps> = ({
  isLoading = false,
  chat,
  onClick,
}) => {
  return (
    <>
      {isLoading && (
        <div className="p-4 flex justify-between h-72px">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 mx-2">
            <Skeleton className="rounded-md h-4 w-40" />
            <Skeleton className="rounded-md h-4 w-40 mt-2px" />
          </div>
          <div className="flex flex-col justify-between items-end">
            <Skeleton className="rounded-md h-4 w-10" />
            <Skeleton className="rounded-full h-5 w-5" />
          </div>
        </div>
      )}
      {!isLoading && chat && (
        <div
          className="p-4 flex justify-between h-72px cursor-pointer"
          onClick={() => {
            onClick && onClick(chat?.id ?? "");
          }}
        >
          <Image
            width={40}
            height={40}
            alt={chat?.author_id ?? ""}
            src={ImgNoImg}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 mx-2" style={{ width: "calc(100% - 121px)" }}>
            <p
              className={`text-sm leading-4 ${
                chat?.marked_up && "lg:font-medium"
              }`}
            >
              {chat?.title ?? ""}
            </p>
            <p className="mt-2px text-sm leading-4 text-neutral-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {chat?.last_message ?? ""}
            </p>
          </div>
          <div className="flex flex-col justify-between items-end">
            <p className="text-zinc-200 text-xs">
              {moment(chat?.created_at ?? 0).format("HH:mm")}
            </p>
            <div
              className={`${
                chat.messages_not_read > 0 ? "bg-sky-600" : "bg-neutral-400"
              } rounded-100px px-6px py-2px`}
            >
              <p className="text-xs text-white text-center">
                {chat.messages_not_read > 0
                  ? chat.messages_not_read
                  : chat.count_message}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMember;
