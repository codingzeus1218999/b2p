"use client";

import { FormTab } from "@/components/Forms";
import {
  LoginCodeForm,
  LoginForm,
  RegisterCodeForm,
  RegisterForm,
  RegisterSlides,
  RegisterTypeForm,
  ResetPwdForm,
} from "@/components/Sections";
import { useAuth } from "@/context/AuthProvider";
import { tabInterface } from "@/interfaces";
import ImgLogo from "@/public/images/Logo.svg";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function AuthPage() {
  const t = useTranslations();
  const router = useRouter();
  const { tab, redirectUrl } = router.query;
  const [activeTab, setActiveTab] = useState<tabInterface>({
    value: "login",
    title: "Вход",
  });
  const [pageState, setPageState] = useState<
    | "register"
    | "registerCode"
    | "registerType"
    | "login"
    | "loginCode"
    | "resetPwd"
    | "slide"
  >("login");

  const [secretToken, setSecretToken] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (tab) {
      if (tab === "login") {
        setPageState("login");
        setActiveTab({ value: "login", title: t("auth.login") });
      }
      if (tab === "register") {
        setPageState("register");
        setActiveTab({ value: "register", title: t("auth.register") });
      }
    }
  }, [tab]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
      return;
    }
  }, []);

  return isLoggedIn ? (
    <></>
  ) : (
    <>
      {pageState !== "slide" && (
        <div
          className={classNames(
            "mt-6 mx-auto w-full lg:w-336px max-w-full flex flex-col items-center",
            {
              "lg:mt-16": ["registerCode", "registerType"].includes(pageState),
            }
          )}
        >
          <Link href="/" className="mb-8">
            <Image width={108} height={24} src={ImgLogo} alt="Logo" />
          </Link>
          {["login", "register", "registerType", "login", "loginCode"].includes(
            pageState
          ) && (
            <div className="py-4 w-full px-4 lg:px-0">
              <FormTab
                list={[
                  { value: "register", title: t("auth.register") },
                  { value: "login", title: t("auth.login") },
                ]}
                activeItem={activeTab}
                onClickTab={(val: tabInterface) => {
                  setActiveTab(val);
                  router.push(
                    `/login?tab=${val.value}${
                      redirectUrl ? "&redirectUrl=" + redirectUrl : ""
                    }`
                  );
                }}
              />
            </div>
          )}
          {pageState === "login" && (
            <div className="w-full">
              <LoginForm
                redirectUrl={redirectUrl as string}
                callbackFunc={(token: string) => {
                  setPageState("loginCode");
                  setAuthToken(token);
                }}
              />
              <div
                className="mt-4 text-sky-600 underline leading-5 text-center cursor-pointer"
                style={{ fontSize: "13px" }}
                onClick={() => setPageState("resetPwd")}
              >
                {t("auth.access_recovery")}
              </div>
            </div>
          )}
          {pageState === "loginCode" && (
            <div className="w-full">
              <LoginCodeForm
                authToken={authToken}
                redirectUrl={redirectUrl as string}
              />
            </div>
          )}
          {pageState === "register" && (
            <div className="w-full">
              <RegisterForm
                callbackFunc={(token: string) => {
                  setSecretToken(token);
                  setPageState("registerCode");
                }}
              />
            </div>
          )}
          {pageState === "registerCode" && (
            <div className="w-full">
              <RegisterCodeForm
                onClick={() => setPageState("registerType")}
                token={secretToken}
              />
            </div>
          )}
          {pageState === "registerType" && (
            <div className="w-full">
              <RegisterTypeForm
                redirectUrl={redirectUrl as string}
                callbackFunc={() => setPageState("slide")}
              />
            </div>
          )}
          {pageState === "resetPwd" && (
            <div className="w-full">
              <ResetPwdForm
                redirectUrl={redirectUrl as string}
                onClickCancel={() => setPageState("login")}
                callbackFunc={(val: string) => {
                  setAuthToken(val);
                  setPageState("loginCode");
                }}
              />
            </div>
          )}
          <div
            className="bg-zinc-100 rounded-100px mx-auto bottom-2 fixed lg:hidden left-1/2"
            style={{
              width: "134px",
              height: "5px",
              transform: "translateX(-67px)",
            }}
          ></div>
        </div>
      )}
      {pageState === "slide" && (
        <RegisterSlides redirectUrl={redirectUrl as string} />
      )}
    </>
  );
}

export default AuthPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
