"use client";

import { ButtonBase } from "@/components/Forms";
import {
  AvatarIcon,
  BagIcon,
  EarPhoneIcon,
  HeartIcon,
  HomeIcon,
} from "@/components/Icons";
import { AuthModal } from "@/components/Sections";
import { AuthModalContext } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthProvider";
import { MenuContext } from "@/context/MenuContext";
import { TicketContext } from "@/context/TicketContext";
import { UserContext } from "@/context/UserContext";
import { LayoutProps } from "@/interfaces";
import ImgLogoF from "@/public/images/logo_f.svg";
import { authRoute } from "@/routes/routes";
import { getAccount } from "@/services/accountsApi";
import { getAboutService, getRules } from "@/services/instructionsApi";
import { RouteClassName } from "@/utils/routeUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { Header } from "../Header";
import { getChromeVersion } from "@/utils/calcUtils";

Modal.setAppElement("body");

const terms: string[] = ["service", "rules"];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const t = useTranslations();
  const titles: Record<string, string> = {
    rules: t("menu.service_rules"),
    service: t("menu.about_service"),
  };
  const { getDecodedToken, isLoggedIn } = useAuth();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<string | boolean>(
    false
  );
  const [rule, setRule] = useState<string | undefined>("");
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [service, setService] = useState<string | undefined>("");
  const { setUser } = useContext(UserContext);
  const { newTicketCount } = useContext(TicketContext);
  const { hide } = useContext(MenuContext);
  const [chromeVersion, setChromeVersion] = useState<number>(0);
  const router = useRouter();
  const {
    isOpenAuthModal,
    setIsOpenAuthModal,
    defaultTab,
    lastProduct,
    callbackFunc,
  } = useContext(AuthModalContext);

  useEffect(() => {
    const cv = getChromeVersion();
    setChromeVersion(cv);
    window.addEventListener("resize", calcWidth);
    fetchServiceData();
    fetchRuleData();
    if (sessionStorage.getItem("access")) {
      fetchUserInfo();
    }
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);

  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const fetchServiceData = async (): Promise<void> => {
    try {
      const data = await getAboutService();
      setService(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const fetchRuleData = async (): Promise<void> => {
    try {
      const data = await getRules();
      setRule(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = (): void => {
    setIsTermsModalOpen(false);
  };

  const handleCancel = (): void => {
    setIsTermsModalOpen(false);
  };

  const fetchUserInfo = async () => {
    try {
      const user = await getAccount();
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const currentPath = router.pathname;
  return (
    <>
      <AuthModal
        isOpen={isOpenAuthModal}
        defaultTab={defaultTab}
        closeModal={() => {
          setIsOpenAuthModal(false);
          if (callbackFunc) callbackFunc();
        }}
        lastProduct={lastProduct}
      />
      <div className="flex flex-col" style={{ minHeight: "100dvh" }}>
        <Modal
          isOpen={!!isTermsModalOpen}
          onRequestClose={handleCancel}
          style={{
            content: {
              width: screenWidth > 1023 ? "536px" : "calc(100% - 32px)",
              borderRadius: "8px",
              height: "min-content",
              maxHeight: "100%",
              background: "white",
              margin: screenWidth > 1023 ? "auto" : "16px 16px auto 16px",
              padding: "24px 16px",
              inset: 0,
            },
            overlay: {
              background: "rgba(12, 44, 75, 0.64)",
              backdropFilter: "blur(4px)",
              zIndex: 300,
              inset: 0,
            },
          }}
        >
          <div className="text-center text-base font-semibold uppercase">
            {titles[isTermsModalOpen as string]}
          </div>
          <div className="my-4 h-px w-full bg-sky-50"></div>

          <div
            dangerouslySetInnerHTML={{
              __html: `${isTermsModalOpen === terms[0] ? service : rule}`,
            }}
          />
          <div className="my-4 h-px w-full bg-sky-50"></div>
          <ButtonBase status="active" type="button" onClick={handleOk}>
            {t("common.close")}
          </ButtonBase>
        </Modal>
        {router.pathname !== "/login" && <Header />}
        <main
          className={`font-ib-m_plex_sans w-full lg:pb-px tracking-[0px] max-w-[1088px] mx-auto relative lg:pt-16 text-neutral-200 flex-1 ${
            hide ? "" : "pb-[62px]"
          }`}
        >
          {children}
        </main>
        <div>
          <footer className="mt-20 hidden lg:block border-t border-t-blue-50">
            <div className="flex items-center justify-between bg-white h-20 max-w-full mx-24">
              <div className="flex items-center">
                <div className="self-stretch mr-8">
                  <Image
                    src={ImgLogoF}
                    width={132}
                    height={30}
                    alt={t("common.logo")}
                  />
                </div>
                <div className="text-neutral-400 text-sm">
                  {t("common.copyright")}
                </div>
              </div>
              <div className="flex items-center text-indigo-300 underline text-sm">
                <div
                  className="cursor-pointer mr-4"
                  onClick={() => setIsTermsModalOpen(terms[0])}
                >
                  {t("menu.about_service")}
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setIsTermsModalOpen(terms[1])}
                >
                  {t("common.rules")}
                </div>
              </div>
            </div>
          </footer>
          <nav
            className={`bg-transparent fixed bottom-0 w-full z-50 lg:order-none flex ${
              getDecodedToken() && isLoggedIn
                ? "justify-between"
                : "justify-center"
            } items-end px-4 pb-4 whitespace-nowrap ${
              getDecodedToken() && isLoggedIn && "backdrop-blur"
            } bg-white text-zinc-900 pt-1 lg:hidden ${hide ? "hidden" : ""} ${
              chromeVersion > 75 ? "bg-opacity-40" : ""
            }`}
            aria-label="Main navigation mobile"
            style={
              getDecodedToken() && isLoggedIn
                ? {}
                : {
                    background: "unset",
                  }
            }
          >
            {getDecodedToken() && isLoggedIn && !hide ? (
              <>
                <div
                  className={RouteClassName(
                    "flex flex-col justify-center items-center",
                    (currentPath === "/" || currentPath === "/search") &&
                      "text-sky-600"
                  )}
                >
                  <Link href="/" className="flex flex-col items-center">
                    <HomeIcon
                      fill={
                        currentPath === "/" || currentPath === "/search"
                          ? "#1976d2"
                          : "#191c1f"
                      }
                    />
                    <div className="text-[9px] leading-[0.375rem] font-medium mt-1">
                      {t("menu.main")}
                    </div>
                  </Link>
                </div>
                <div
                  className={RouteClassName(
                    "flex flex-col justify-center items-center",
                    currentPath.includes("/favorites") && "text-sky-600"
                  )}
                >
                  <Link
                    href="/favorites"
                    className="flex flex-col items-center"
                  >
                    <HeartIcon
                      fill={
                        currentPath.includes("/favorites")
                          ? "#1976d2"
                          : "#191c1f"
                      }
                    />
                    <div className="text-[9px] leading-[0.375rem] font-medium mt-1">
                      {t("menu.favorites")}
                    </div>
                  </Link>
                </div>
                <div
                  className={RouteClassName(
                    "flex flex-col items-center self-stretch",
                    currentPath.includes("/tickets") && "text-sky-600"
                  )}
                >
                  <Link
                    href="/tickets"
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className="rounded-full p-2 mb-1"
                      style={{
                        background: currentPath.includes("/tickets")
                          ? "#1976d2"
                          : "rgba(227, 227, 229, 0.4)",
                      }}
                    >
                      <EarPhoneIcon
                        fill={
                          currentPath.includes("/tickets") ? "white" : "#191c1f"
                        }
                      />
                    </div>
                    <div className="text-[9px] leading-[0.375rem] font-medium">
                      {t("menu.tickets")}
                    </div>
                    {newTicketCount > 0 && (
                      <div
                        className="absolute top-0 text-white bg-sky-600 rounded-full h-3 w-3 flex justify-center items-center right-0"
                        style={{
                          fontSize: "8px",
                          lineHeight: "8px",
                        }}
                      >
                        <span>{newTicketCount}</span>
                      </div>
                    )}
                  </Link>
                </div>
                <div
                  className={RouteClassName(
                    "flex flex-col justify-center items-center",
                    currentPath.includes("/buyers") && "text-sky-600"
                  )}
                >
                  <Link
                    href="/buyers"
                    className="flex flex-col items-center am-gapY-4px"
                  >
                    <BagIcon
                      fill={
                        currentPath.includes("/buyers") ? "#1976d2" : "#191c1f"
                      }
                    />
                    <div className="text-[9px] leading-[0.375rem] font-medium">
                      {t("common.buyers")}
                    </div>
                  </Link>
                </div>
                <div
                  className={RouteClassName(
                    "flex flex-col justify-center items-center",
                    currentPath.includes("/profile") && "text-sky-600"
                  )}
                >
                  <Link
                    href="/profile"
                    className="flex flex-col items-center am-gapY-4px"
                  >
                    <AvatarIcon
                      fill={
                        currentPath.includes("/profile") ? "#1976d2" : "#191c1f"
                      }
                    />
                    <div className="text-[9px] leading-[0.375rem] font-medium">
                      {t("common.profile")}
                    </div>
                  </Link>
                </div>
              </>
            ) : !isLoggedIn ? (
              !router.pathname.includes(authRoute[0]) &&
              !router.pathname.includes(authRoute[0]) && (
                <ul className="flex justify-center am-gapX-16px text-center text-sm leading-5 p-4 bg-white rounded-lg shadow-custom-6">
                  <li className="flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 active:!bg-sky-700 active:!text-white text-sky-600">
                    <div
                      className="flex-grow text-center  min-w-[122px] px-4 py-2 cursor-pointer"
                      onClick={() => router.push("/login?tab=login")}
                    >
                      {t("auth.login")}
                    </div>
                  </li>
                  <li className="flex items-center justify-center rounded-xl bg-indigo-300 hover:bg-indigo-80 active:!bg-sky-700">
                    <div
                      className="flex-grow text-center text-white min-w-[122px] px-4 py-2 cursor-pointer"
                      onClick={() => router.push("/login?tab=register")}
                    >
                      {t("auth.register")}
                    </div>
                  </li>
                </ul>
              )
            ) : (
              <></>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Layout;
