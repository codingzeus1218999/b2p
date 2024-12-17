"use client";

import { LostNetModal } from "@/components/Units";
import { LOCALSTORAGES, STATUS_CODES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { BlurProvider } from "@/context/BlurContext";
import { DefaultTypeProvider } from "@/context/DefaultTypeContext";
import { DropdownOpenProvider } from "@/context/DropdownOpenContext";
import { FilterProvider } from "@/context/FilterContext";
import { MenuProvider } from "@/context/MenuContext";
import { ScrollContext, ScrollProvider } from "@/context/ScrollContext";
import { StockProvider } from "@/context/StockContext";
import { TicketContext, TicketProvider } from "@/context/TicketContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { accountInterface } from "@/interfaces";
import { getAccount } from "@/services/accountsApi";
import {
  checkNetworkState,
  fetchConfigurations,
} from "@/services/configurationsApi";
import { getLostNetworkText } from "@/services/instructionsApi";
import { checkChats } from "@/services/messagesApi";
import "@/styles/globals.css";
import { saveDataInLocalStorage } from "@/utils/calcUtils";
import "array-includes/shim";
import "core-js/stable";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import "regenerator-runtime/runtime";

let intervalHealthCheck: NodeJS.Timeout;
let intervalBalance: NodeJS.Timeout;
let intervalTickets: NodeJS.Timeout;

function MyApp({ Component, pageProps }: AppProps) {
  const t = useTranslations();
  const [oldUserInfo, setOldUserInfo] = useState<accountInterface>();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { user, setUser } = useUser();
  const { showToast } = useToast();
  const { setNewTicketCount } = useContext(TicketContext);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>(router.asPath);
  const [netOff, setNetOff] = useState<boolean>(false);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setCurrentPath(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    setOldUserInfo(user);
    const loadPolyfills = async () => {
      require("whatwg-fetch");
      const PromisePolyfill = require("promise-polyfill").default;

      if (!window.Promise) {
        window.Promise = PromisePolyfill;
      }
    };
    const getTextLostNetwork = async () => {
      const res = await getLostNetworkText();
      saveDataInLocalStorage(LOCALSTORAGES.TEXT_LOST_NETWORK, res);
    };

    loadPolyfills();
    getTextLostNetwork();
    const checkNet = async () => {
      intervalHealthCheck = setInterval(async () => {
        try {
          const res = await checkNetworkState();
          if (res?.data?.status === STATUS_CODES.OK) setNetOff(false);
          else setNetOff(true);
        } catch (err) {
          setNetOff(true);
        }
      }, MAGIC_NUMBERS.CHECK_HEALTH_TIME_INTERVAL * 1000);
    };

    checkNet();

    return () => {
      clearInterval(intervalBalance);
      clearInterval(intervalHealthCheck);
      clearInterval(intervalTickets);
    };
  }, []);

  useEffect(() => {
    const fetchIntervalConfig = async () => {
      const res = (await fetchConfigurations())["configuration"];
      saveDataInLocalStorage(
        LOCALSTORAGES.INTERVAL_BALANCE,
        res.balance_interval
      );
      saveDataInLocalStorage(
        LOCALSTORAGES.INTERVAL_PAYMENT,
        res.payment_interval
      );
      saveDataInLocalStorage(
        LOCALSTORAGES.INTERVAL_MESSAGE,
        res.message_update_interval
      );
      intervalBalance = setInterval(async () => {
        try {
          const res = await getAccount();
          setUser(res);
        } catch (err: any) {
          console.log("Error getting user data interval", err);
          if (err?.response?.data?.code === STATUS_CODES.UNAUTHORIZED) {
            window.sessionStorage.removeItem("access");
            window.sessionStorage.removeItem("refresh");
            setIsLoggedIn(false);
            if (
              currentPath.includes("balance") ||
              currentPath.includes("profile") ||
              currentPath.includes("coupons") ||
              currentPath.includes("favorites") ||
              currentPath.includes("history") ||
              currentPath.includes("orders") ||
              currentPath.includes("tickets") ||
              currentPath.includes("/buy/")
            ) {
              router.push("/");
            }
          }
        }
      }, res.balance_interval * 1000);
      intervalTickets = setInterval(async () => {
        try {
          const res = await checkChats();
          setNewTicketCount(res.messages);
        } catch (err) {
          console.log("Error getting chat data interval", err);
        }
      }, res.message_update_interval * 1000);
    };
    if (isLoggedIn) {
      fetchIntervalConfig();
    } else {
      clearInterval(intervalBalance);
      clearInterval(intervalTickets);
    }
    return () => {
      clearInterval(intervalBalance);
      clearInterval(intervalTickets);
    };
  }, [isLoggedIn, currentPath]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!oldUserInfo) return;
    if (user.id !== oldUserInfo.id) return;
    if (user.balance > (oldUserInfo?.balance ?? 0))
      showToast(
        `${t("home.topuped")} ${Number(
          user.balance - (oldUserInfo?.balance ?? 0)
        ).toLocaleString("ru-RU")} ₽`,
        "success"
      );
    setOldUserInfo(user);
  }, [user]);

  const { scroll } = useContext(ScrollContext);

  useEffect(() => {
    if (scroll) {
      document.body.style.overflow = "visible";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [scroll]);

  return (
    <NextIntlClientProvider
      locale="ru"
      timeZone="Europe/Moscow"
      messages={pageProps.messages}
    >
      <LostNetModal isOpen={netOff} />
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

const MyAppWithProvider = (props: AppProps) => (
  <NextIntlClientProvider
    locale="ru"
    timeZone="Europe/Moscow"
    messages={props.pageProps.messages}
  >
    <DefaultTypeProvider>
      <MenuProvider>
        <TicketProvider>
          <ToastProvider>
            <AuthModalProvider>
              <DropdownOpenProvider>
                <UserProvider>
                  <FilterProvider>
                    <StockProvider>
                      <BlurProvider>
                        <ScrollProvider>
                          <AuthProvider>
                            <MyApp {...props} />
                          </AuthProvider>
                        </ScrollProvider>
                      </BlurProvider>
                    </StockProvider>
                  </FilterProvider>
                </UserProvider>
              </DropdownOpenProvider>
            </AuthModalProvider>
          </ToastProvider>
        </TicketProvider>
      </MenuProvider>
    </DefaultTypeProvider>
  </NextIntlClientProvider>
);

export default MyAppWithProvider;
