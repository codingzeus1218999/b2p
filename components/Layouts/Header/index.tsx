"use client";

import { ButtonWhite } from "@/components/Forms";
import { Skeleton } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import { TicketContext } from "@/context/TicketContext";
import { UserContext } from "@/context/UserContext";
import { IHeaderItems } from "@/interfaces";
import ImgLogo from "@/public/images/Logo.svg";
import ImgDefaultAvatar from "@/public/images/default-avatar.png";
import { fetchMenu } from "@/services/configurationsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

export const Header = () => {
  const t = useTranslations();
  const { getDecodedToken } = useAuth();
  const { newTicketCount } = useContext(TicketContext);
  const [headerItems, setHeaderItems] = useState<IHeaderItems[]>(
    getDataFromLocalStorageWithExpiry(LOCALSTORAGES.MENU) ?? []
  );
  const [isMnuOpen, setIsMnuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleMouseEnter = () => setIsMnuOpen(true);
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (
        menuRef.current &&
        avatarRef.current &&
        !menuRef.current.matches(":hover") &&
        !avatarRef.current.matches(":hover")
      ) {
        setIsMnuOpen(false);
      }
    }, 100);
  };

  const getHeaderItems = async () => {
    if (getDataFromLocalStorageWithExpiry(LOCALSTORAGES.MENU))
      saveDataInLocalStorage(
        LOCALSTORAGES.MENU,
        getDataFromLocalStorageWithExpiry(LOCALSTORAGES.MENU)
      );
    else {
      try {
        const data = await fetchMenu();
        setHeaderItems(data);
        saveDataInLocalStorage(LOCALSTORAGES.MENU, data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    getDecodedToken() && getHeaderItems();
  }, [getDecodedToken]);

  const logOut = () => {
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    window.location.reload();
  };

  return (
    <header>
      <div className="bg-white relative" style={{ zIndex: 257 }}>
        <div className="top-nav shadow-[0_4px_24px_0px_rgba(25,118,210,0.16)] hidden lg:block fixed w-full bg-white min-h-16 z-40">
          <nav
            ref={menuRef}
            role="complementary"
            className="flex items-center py-3.5 justify-between max-w-full mx-24"
          >
            <div className="logo">
              <Link href="/">
                <Image
                  className="h-6 max-w-[107px] w-full"
                  width={107}
                  height={24}
                  src={ImgLogo}
                  alt="Logo"
                />
              </Link>
            </div>
            {getDecodedToken() ? (
              <div className="flex justify-center am-gapX-24px text-center text-sm leading-5 items-center	">
                {headerItems.map((e: IHeaderItems, i: number) => (
                  <div key={i}>
                    <Link href={e.path} className="relative text-sm leading-6">
                      {e.title}
                      {newTicketCount > 0 && i === headerItems.length - 1 && (
                        <div
                          className="absolute top-0 text-white bg-sky-600 rounded-full h-3 w-3 flex justify-center items-center"
                          style={{
                            fontSize: "8px",
                            lineHeight: "8px",
                            left: "calc(100% + 2px)",
                          }}
                        >
                          <span>{newTicketCount}</span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
                <div
                  className="ml-14px relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden"
                    ref={avatarRef}
                  >
                    {user ? (
                      <img
                        width={32}
                        height={32}
                        src={user?.file?.path ?? ImgDefaultAvatar}
                        alt={user?.username ?? t("common.avatar")}
                        className="rounded-full object-cover cursor-pointer w-8 h-8"
                      />
                    ) : (
                      <Skeleton className="w-8 h-8 rounded-full" />
                    )}
                  </div>
                  <div
                    ref={menuRef}
                    className={`${
                      isMnuOpen ? "active" : ""
                    } menu absolute right-0 bg-white opacity-0 transform scale-90 invisible transition-all duration-300 rounded-lg`}
                    style={{ top: "calc(100% + 14px)", width: "288px" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className="absolute -top-2 w-5 h-5 bg-white rotate-45 z-[-1]"
                      style={{
                        right: "6px",
                        boxShadow: "0px 4px 24px rgba(25, 118, 210, 0.16)",
                      }}
                    ></div>
                    <div className="z-10 bg-white rounded-lg">
                      <div className="items-start am-gapX-20px flex p-4">
                        {user ? (
                          <img
                            src={user?.file?.path ?? ImgDefaultAvatar}
                            alt={user?.username ?? t("common.avatar")}
                            width={56}
                            height={56}
                            className="rounded-full object-cover w-56px h-56px"
                          />
                        ) : (
                          <Skeleton className="h-14 w-14 rounded-full" />
                        )}
                        <div className="flex flex-col am-gapY-4px items-start">
                          <p
                            className="font-bold leading-5 overflow-hidden text-ellipsis whitespace-nowrap text-left"
                            style={{ width: "172px" }}
                          >
                            {user?.username}
                          </p>
                          <p className="text-neutral-400 text-sm">
                            {Number(user?.balance ?? 0).toLocaleString("ru-RU")}{" "}
                            ₽
                          </p>
                          <Link
                            href="/profile"
                            className="text-sky-600 underline text-sm"
                            style={{ lineHeight: "14px" }}
                          >
                            {t("profile.personal_account")}
                          </Link>
                        </div>
                      </div>
                      <div className="h-px bg-zinc-100"></div>
                      <div className="p-4" style={{ width: "288px" }}>
                        <ButtonWhite status="active" onClick={logOut}>
                          {t("auth.logout")}
                        </ButtonWhite>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ul className="flex justify-center am-gapX-16px text-center text-sm leading-5">
                <li className="flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 active:!bg-sky-700 text-sky-600 active:!text-white">
                  <div
                    className="flex-grow text-center  px-6 py-2 cursor-pointer"
                    onClick={() => router.push("/login?tab=login")}
                  >
                    {t("auth.login")}
                  </div>
                </li>
                <li className="flex items-center justify-center rounded-xl bg-indigo-300 hover:bg-indigo-80 active:!bg-sky-700">
                  <div
                    className="flex-grow text-center text-white px-8 py-2 cursor-pointer"
                    onClick={() => router.push("/login?tab=register")}
                  >
                    {t("auth.register")}
                  </div>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
