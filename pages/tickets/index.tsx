"use client";

import { Layout } from "@/components/Layouts";
import { ChatHistory, ChatList, ChatNew } from "@/components/Sections";
import { useAuth } from "@/context/AuthProvider";
import { MenuContext } from "@/context/MenuContext";
import { chatInterface, chatTypeInterface } from "@/interfaces";
import { getChatTypes, getChats } from "@/services/messagesApi";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";

const ChatPage = () => {
  const t = useTranslations();
  const [isLoadingInitData, setIsLoadingInitData] = useState<boolean>(true);
  const [chatTypes, setChatTypes] = useState<chatTypeInterface[]>([]);
  const [chats, setChats] = useState<chatInterface[]>([]);
  const [pageState, setPageState] = useState<"init" | "new" | "chat">("init");
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const { setHide } = useContext(MenuContext);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    getInitData();
    return () => {
      setHide(false);
    };
  }, []);
  useEffect(() => {
    if (pageState === "chat") {
      setHide(true);
    } else setHide(false);
  }, [pageState]);

  const getInitData = async () => {
    try {
      setIsLoadingInitData(true);
      const cts = await getChatTypes();
      const cs = await getChats();
      setChatTypes(cts);
      setChats(cs.data);
    } catch (err) {
      console.log("Error fetching init data");
    } finally {
      setIsLoadingInitData(false);
    }
  };

  return (
    <Layout>
      {isLoggedIn && (
        <>
          <div className="hidden lg:flex mt-8 h-calc-1">
            <ChatList
              chats={chats}
              isLoading={isLoadingInitData}
              onClickNew={() => setPageState("new")}
              onClickMember={(val: string) => {
                setSelectedChatId(val);
                setPageState("chat");
              }}
            />
            <div className="flex-1 ml-4">
              {pageState === "init" && (
                <p className="leading-5 text-neutral-400 font-medium text-center">
                  {t("ticket.select")}
                </p>
              )}
              {pageState === "new" && (
                <ChatNew
                  chatTypes={chatTypes}
                  onCancel={() => setPageState("init")}
                  onAfterSend={(id: string) => {
                    setSelectedChatId(id);
                    setPageState("chat");
                  }}
                />
              )}
              {pageState === "chat" && (
                <ChatHistory
                  chatId={selectedChatId}
                  onClickBack={() => setPageState("init")}
                />
              )}
            </div>
          </div>
          <div className="lg:hidden">
            {pageState === "init" && (
              <ChatList
                chats={chats}
                isLoading={isLoadingInitData}
                onClickNew={() => setPageState("new")}
                onClickMember={(val: string) => {
                  setSelectedChatId(val);
                  setPageState("chat");
                }}
              />
            )}
            {pageState === "new" && (
              <ChatNew
                chatTypes={chatTypes}
                onCancel={() => setPageState("init")}
                onAfterSend={(id: string) => {
                  setSelectedChatId(id);
                  setPageState("chat");
                }}
              />
            )}
            {pageState === "chat" && (
              <ChatHistory
                chatId={selectedChatId}
                onClickBack={() => setPageState("init")}
              />
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ChatPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
