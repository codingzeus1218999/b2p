"use client";

import { CollapseIcon, EditIcon } from "@/components/Icons";
import { ChatMember } from "@/components/Units";
import { ChatListProps } from "@/interfaces";
import { useTranslations } from "next-intl";

const ChatList: React.FC<ChatListProps> = ({
  isLoading,
  chats,
  onClickNew,
  onClickMember,
}) => {
  const t = useTranslations();
  return (
    <div className="lg:rounded-lg lg:shadow-custom-1 lg:w-352px w-full lg:max-w-352px lg:min-w-352px lg:max-w-full scroll-hide">
      <div className="p-4 flex items-center justify-between">
        <p className="text-2xl lg:py-2.5px font-semibold">
          {t("menu.tickets")}
        </p>
        <EditIcon className="cursor-pointer" onClick={onClickNew} />
      </div>
      <div className="mt-2">
        <div className="py-2 px-4 text-xs font-semibold text-neutral-400 flex items-center am-gapX-5px">
          <CollapseIcon />
          <span>{t("ticket.pinned_chats")}</span>
        </div>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, _idx) => (
              <>
                <ChatMember key={_idx} isLoading={true} />
                {_idx !== 2 && <div className="w-full h-px bg-sky-50"></div>}
              </>
            ))
        ) : (
          // TODO: pinned chats
          // chats
          //     .filter((t) => t.marked_up)
          //     .map((c, _idx) => (
          //       <>
          //         <ChatMember key={_idx} chat={c} onClick={onClickMember} />
          //         {_idx !== chats.filter((t) => t.marked_up).length - 1 && (
          //           <div className="w-full h-px bg-sky-50"></div>
          //         )}
          //       </>
          //     ))
          <></>
        )}
        <div className="px-4 py-2">
          <div className="w-full h-px bg-sky-50"></div>
          <div className="mt-4 text-xs font-semibold text-neutral-400 flex items-center am-gapX-5px">
            <CollapseIcon />
            <span>{t("ticket.personal_messages")}</span>
          </div>
        </div>
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, _idx) => (
                <>
                  <ChatMember key={_idx} isLoading={true} />
                  {_idx !== 2 && <div className="w-full h-px bg-sky-50"></div>}
                </>
              ))
          : chats.map((c, _idx) => (
              <>
                <ChatMember key={_idx} chat={c} onClick={onClickMember} />
                {_idx !== chats.length - 1 && (
                  <div className="w-full h-px bg-sky-50"></div>
                )}
              </>
            ))}
      </div>
    </div>
  );
};

export default ChatList;
