"use client";

import {
  ButtonBase,
  ButtonWhite,
  DropdownBoxWithSearch2,
} from "@/components/Forms";
import { LeftIcon, RightIcon } from "@/components/Icons";
import { Spinner } from "@/components/Units";
import { useToast } from "@/context/ToastContext";
import { ChatNewProps, dropdownItemInterface } from "@/interfaces";
import { createChat } from "@/services/messagesApi";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ChatNew: React.FC<ChatNewProps> = ({
  chatTypes,
  onCancel,
  onAfterSend,
}) => {
  const t = useTranslations();
  const [selectedType, setSelectedType] =
    useState<dropdownItemInterface | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [pageState, setPageState] = useState<"type" | "content">("type");
  const { showToast } = useToast();

  const onClickSend = async () => {
    if (selectedType === null || msg === "") return;
    setSending(true);
    try {
      const res = await createChat({
        type_id: selectedType.value,
        message: msg,
      });
      onAfterSend(res.id);
    } catch (err: any) {
      console.log("Error creating chat", err);
      showToast(err?.response?.data?.errors?.throttling, "error");
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <div className="hidden lg:block">
        <p className="p-4 text-right text-2xl font-semibold">
          {t("ticket.create_new")}
        </p>
        <div className="p-4 shadow-custom-1 rounded-lg flex flex-col am-gapY-16px">
          <DropdownBoxWithSearch2
            label={t("common.topic")}
            activeItem={selectedType}
            list={chatTypes.map((v) => ({ label: v.title, value: v.id }))}
            onChange={(v) => setSelectedType(v)}
            type={2}
          />
          <div>
            <input
              type="text"
              className="px-4 py-13px rounded-lg w-full bg-gray-100 text-sm focus:text-sky-600 border border-gray-100 focus:border-sky-600 focus:bg-white"
              placeholder={t("order.input_feedback_text")}
              value={msg}
              onChange={(e) => setMsg(e.target.value.slice(0, 256))}
            />
            <p className="text-xs text-zinc-200 leading-none mt-3">
              {t("ticket.max_string")}
            </p>
          </div>
          <div className="flex flex-col am-gapY-12px">
            <ButtonBase
              status={selectedType && msg && !sending ? "active" : "disable"}
              onClick={onClickSend}
            >
              {sending ? (
                <Spinner size={26} color="white" innerColor="#b1b1b1" />
              ) : (
                t("common.send")
              )}
            </ButtonBase>
            <ButtonWhite onClick={onCancel} status="active">
              {t("common.cancel")}
            </ButtonWhite>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <div className="px-4 py-3 relative text-center font-semibold text-base leading-10">
          <LeftIcon
            className="absolute cursor-pointer left-4 top-5"
            onClick={onCancel}
          />
          {t("ticket.new")}
        </div>
        {pageState === "type" && (
          <div className="flex flex-col">
            {chatTypes.map((ct, _idx) => (
              <div
                onClick={() => {
                  setSelectedType({ label: ct.title, value: ct.id });
                  setPageState("content");
                }}
                key={_idx}
                className="p-4 flex justify-between items-center am-gapX-8px border-b border-b-gray-50"
              >
                <div className="flex-1">
                  <p className="text-sm leading-14px">{ct.title}</p>
                  <p className="text-xs mt-2 text-zinc-400">
                    {t("ticket.secondary_hint_text")}
                  </p>
                </div>
                <RightIcon />
              </div>
            ))}
          </div>
        )}
        {pageState === "content" && (
          <div className="p-4">
            <div>
              <input
                type="text"
                className="px-4 py-13px rounded-lg w-full bg-gray-100 text-sm focus:text-sky-600 border border-gray-100 focus:border-sky-600 focus:bg-white"
                placeholder={t("order.input_feedback_text")}
                value={msg}
                onChange={(e) => setMsg(e.target.value.slice(0, 256))}
              />
              <p className="text-xs text-zinc-200 leading-none mt-3">
                {t("ticket.max_string")}
              </p>
            </div>
            <div className="flex flex-col am-gapY-12px mt-4">
              <ButtonBase
                status={selectedType && msg && !sending ? "active" : "disable"}
                onClick={onClickSend}
              >
                {sending ? (
                  <Spinner size={26} color="white" innerColor="#b1b1b1" />
                ) : (
                  t("common.send")
                )}
              </ButtonBase>
              <ButtonWhite onClick={onCancel} status="active">
                {t("common.cancel")}
              </ButtonWhite>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatNew;
