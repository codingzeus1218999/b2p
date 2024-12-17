"use client";

import {
  ButtonBase,
  ButtonWhite,
  CheckBox,
  DropdownBoxWithSearch1,
  DropdownBoxWithSearchMobile1,
  InputField,
  PasswordFiled,
} from "@/components/Forms";
import { GuardIcon, HumanIcon } from "@/components/Icons";
import { CopyIconButton, Spinner } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { ScrollContext } from "@/context/ScrollContext";
import { AuthModalProps, dropdownItemInterface } from "@/interfaces";
import ImgLogo from "@/public/images/Logo.svg";
import { changeAccountDefaultTypeSize, check } from "@/services/accountsApi";
import { fetchTypes } from "@/services/directoriesApi";
import { getRules } from "@/services/instructionsApi";
import {
  checkf2a,
  login,
  recoveryToken,
  resetPassword,
  signup,
} from "@/services/signsApi";
import { saveDataInLocalStorage } from "@/utils/calcUtils";
import { mapTypesToDropdownData } from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  closeModal,
  defaultTab,
  lastProduct,
}) => {
  const t = useTranslations();
  const [pageState, setPageState] = useState<
    "auth" | "code" | "defaultType" | "resetPwd"
  >("auth");
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loginState, setLoginState] = useState<"form" | "code">("form");
  const [username, setUsername] = useState<string>("");
  const [usernameErr, setUsernameErr] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");
  const [logining, setLogining] = useState<boolean>(false);
  const [regLogin, setRegLogin] = useState<string>("");
  const [regLoginErr, setRegLoginErr] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regUsernameErr, setRegUsernameErr] = useState<string>("");
  const [regPwd, setRegPwd] = useState<string>("");
  const [regPwdErr, setRegPwdErr] = useState<string>("");
  const [regConPwd, setRegConPwd] = useState<string>("");
  const [regConPwdErr, setRegConPwdErr] = useState<string>("");
  const [regAgree, setRegAgree] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);
  const [f2acode, setF2acode] = useState<string>("");
  const [f2acodeErr, setF2acodeErr] = useState<string>("");
  const [f2aing, setF2aing] = useState<boolean>(false);
  const [secretToken, setSecretToken] = useState<string>("");
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const { setScroll } = useContext(ScrollContext);
  const [isOpenRuleModal, setIsOpenRuleModal] = useState<boolean>(false);
  const [rules, setRules] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [resetLogin, setResetLogin] = useState<string>("");
  const [resetLoginError, setResetLoginError] = useState<string>("");
  const [resetSecretToken, setResetSecretToken] = useState<string>("");
  const [resetSecretTokenError, setResetSecretTokenError] =
    useState<string>("");
  const [resetPwd, setResetPwd] = useState<string>("");
  const [resetPwdError, setResetPwdError] = useState<string>("");
  const [resetPwdConfirm, setResetPwdConfirm] = useState<string>("");
  const [resetPwdConfirmError, setResetPwdConfirmError] = useState<string>("");
  const [changing, setChanging] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    setScroll(!isOpen);
    calcScreenWidth();
  }, [isOpen]);

  useEffect(() => {
    getInitData();
    window.addEventListener("resize", calcScreenWidth);
    return () => {
      window.removeEventListener("resize", calcScreenWidth);
    };
  }, []);

  const calcScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const getInitData = async (): Promise<void> => {
    try {
      const tl = mapTypesToDropdownData(await fetchTypes());
      const rl = await getRules();
      setTypeList(tl);
      setRules(rl);
    } catch (err) {
      console.log("Error fetching the initial data");
    }
  };

  const onClickLogin = async () => {
    setUsernameErr("");
    setPasswordErr("");
    setLogining(true);
    try {
      const res = await login(username, password);
      if (res?.two_factor) {
        setLoginState("code");
        setAuthToken(res.auth_token);
      } else {
        if (lastProduct)
          saveDataInLocalStorage(LOCALSTORAGES.LAST_SEARCH_STATE, {
            pid: lastProduct,
            initload: true,
          });
        location.reload();
      }
    } catch (err: any) {
      setUsernameErr(err?.response?.data?.errors?.login);
      setPasswordErr(err?.response?.data?.errors?.password);
    } finally {
      setLogining(false);
    }
  };

  const onClickF2a = async () => {
    setF2aing(true);
    setF2acodeErr("");
    try {
      const res = await checkf2a(f2acode, authToken);
      if (lastProduct)
        saveDataInLocalStorage(LOCALSTORAGES.LAST_SEARCH_STATE, {
          pid: lastProduct,
          initload: true,
        });
      location.reload();
    } catch (err: any) {
      setF2acodeErr(err?.response?.data?.errors?.code);
    } finally {
      setF2aing(false);
    }
  };

  const onChangeRegLogin = async (val: string) => {
    setRegLogin(val);
    setRegLoginErr("");
    if (val.length < 4) return;
    try {
      const res = await check(val);
      setRegLoginErr("");
    } catch (err: any) {
      if (err.response.status === 409) {
        setRegLoginErr(t("auth.double_login_err"));
      }
    }
  };

  const onChangePassword = (val: string) => {
    setPassword(val);
    if (val.length < 6) {
      setPasswordErr(t("auth.short_pwd_err"));
    } else {
      setPasswordErr("");
    }
  };

  const onChangeRegPwd = (val: string) => {
    setRegPwd(val);
    if (val.length < 6) {
      setRegPwdErr(t("auth.short_pwd_err"));
    } else {
      setRegPwdErr("");
    }
  };

  const onChangeConfirmPwd = (val: string) => {
    setRegConPwd(val);
    setRegConPwdErr(regPwd === val ? "" : t("auth.not_match_pwd_err"));
  };

  const onClickRegister = async () => {
    setRegLoginErr("");
    setRegUsernameErr("");
    setRegPwdErr("");
    setRegConPwdErr("");
    setRegistering(true);
    try {
      const res = await signup(regLogin, regUsername, regPwd, regConPwd);
      const st = await recoveryToken();
      setSecretToken(st);
      setPageState("code");
    } catch (err: any) {
      console.log(err);
      setRegLoginErr(err?.response?.data?.errors?.login);
    } finally {
      setRegistering(false);
    }
  };

  const onClickSelectDefaultType = async () => {
    if (!selectedType) return;
    try {
      const res = await changeAccountDefaultTypeSize(selectedType?.value);
      if (lastProduct)
        saveDataInLocalStorage(LOCALSTORAGES.LAST_SEARCH_STATE, {
          pid: lastProduct,
          initload: true,
        });
      location.reload();
    } catch (err: any) {
      console.log(err);
    }
  };

  const onChangeResetPwd = (val: string) => {
    setResetPwd(val);
    if (val.length < 6) {
      setResetPwdError(t("auth.short_pwd_err"));
    } else {
      setResetPwdError("");
    }
  };

  const onChangeResetPwdConfirm = (val: string) => {
    setResetPwdConfirm(val);
    setResetPwdConfirmError(
      password === val ? "" : t("auth.not_match_pwd_err")
    );
  };

  const onClickChangePwd = async () => {
    setChanging(true);
    try {
      const res = await resetPassword(
        resetLogin,
        resetSecretToken,
        resetPwd,
        resetPwdConfirm
      );
      if (res?.two_factor) {
        setAuthToken(res.auth_token);
        setActiveTab("login");
        setPageState("auth");
        setLoginState("code");
      } else {
        if (lastProduct)
          saveDataInLocalStorage(LOCALSTORAGES.LAST_SEARCH_STATE, {
            pid: lastProduct,
            initload: true,
          });
        location.reload();
      }
    } catch (err: any) {
      console.log("Error chaning password", err);
      setResetSecretTokenError(err?.response?.data?.errors?.secret_token);
      setResetLoginError(err?.response?.data?.errors?.login);
    } finally {
      setChanging(false);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpenRuleModal}
        onRequestClose={() => setIsOpenRuleModal(false)}
        style={{
          content: {
            width: screenWidth > 1023 ? "536px" : "calc(100% - 32px)",
            borderRadius: "8px",
            height: "min-content",
            maxHeight: "100%",
            background: "white",
            margin: screenWidth > 1023 ? "auto" : "16px 16px auto 16px",
            padding: "24px 16px",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          },
          overlay: {
            background: "rgba(12, 44, 75, 0.64)",
            backdropFilter: "blur(4px)",
            zIndex: 301,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: rules }} />
        <div className="my-4 h-px w-full bg-sky-50"></div>
        <ButtonBase
          onClick={() => {
            setRegAgree(true);
            setIsOpenRuleModal(false);
          }}
          status="active"
        >
          {t("common.accept")}
        </ButtonBase>
      </Modal>
      <Modal
        isOpen={isOpen && screenWidth > 1023 ? true : false}
        onRequestClose={closeModal}
        style={{
          content: {
            maxWidth: "352px",
            width: "100%",
            border: "none",
            borderRadius: "12px",
            background: "white",
            padding: "8px",
            height: "fit-content",
            maxHeight: "100%",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            margin: "100px auto auto auto",
            overflow: "visible",
          },
          overlay: {
            background: "rgba(12, 44, 75, 0.64)",
            backdropFilter: "blur(4px)",
            position: "fixed",
            zIndex: 300,
            width: "100vw",
            top: 0,
            left: 0,
          },
        }}
      >
        {pageState === "auth" && (
          <div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div
                className={`cursor-pointer text-center text-base leading-7 ${
                  activeTab === "register"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : ""
                }`}
                onClick={() => setActiveTab("register")}
              >
                {t("auth.register")}
              </div>
              <div
                className={`cursor-pointer text-center text-base leading-7 ${
                  activeTab === "login"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : ""
                }`}
                onClick={() => setActiveTab("login")}
              >
                {t("auth.login")}
              </div>
            </div>
            <div className="shadow-custom-7 rounded-lg">
              {activeTab === "login" && loginState === "form" && (
                <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
                  <div className="rounded-t-lg overflow-hidden">
                    <InputField
                      value={username}
                      onChange={setUsername}
                      placeholder={t("common.login")}
                      errMsg={usernameErr}
                    />
                  </div>
                  <div>
                    <PasswordFiled
                      value={password}
                      onChange={onChangePassword}
                      placeholder={t("common.password")}
                      errMsg={passwordErr}
                    />
                  </div>
                  <div className="bg-white rounded-b-lg overflow-hidden">
                    <div className="px-4 pt-5 bg-white">
                      <ButtonBase
                        type="submit"
                        status={`${
                          username.length > 2 && password.length > 5
                            ? logining
                              ? "disable"
                              : "active"
                            : "disable"
                        }`}
                        onClick={onClickLogin}
                      >
                        {logining ? (
                          <Spinner
                            color="white"
                            size={26}
                            innerColor="#b1b1b1"
                          />
                        ) : (
                          <span>{t("auth.enter")}</span>
                        )}
                      </ButtonBase>
                    </div>
                    <div className="px-4 pt-3 bg-white">
                      <ButtonWhite status="active" onClick={closeModal}>
                        <span>{t("common.cancel")}</span>
                      </ButtonWhite>
                    </div>
                    <div
                      className="pt-3 text-sky-600 underline leading-8 text-center pb-4 cursor-pointer"
                      style={{ fontSize: "13px" }}
                      onClick={() => setPageState("resetPwd")}
                    >
                      {t("auth.access_recovery")}
                    </div>
                  </div>
                </form>
              )}
              {activeTab === "login" && loginState === "code" && (
                <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
                  <div className="rounded-t-lg overflow-hidden">
                    <InputField
                      value={f2acode}
                      onChange={setF2acode}
                      placeholder={t("auth.code_from_google")}
                      errMsg={f2acodeErr}
                      available={f2acode.length === 6}
                    />
                  </div>
                  <div className="bg-white rounded-b-lg overflow-hidden">
                    <div className="px-4 pt-5">
                      <ButtonBase
                        type="submit"
                        status={`${
                          f2acode.length === 6
                            ? f2aing
                              ? "disable"
                              : "active"
                            : "disable"
                        }`}
                        onClick={onClickF2a}
                      >
                        {f2aing ? (
                          <Spinner
                            color="white"
                            size={26}
                            innerColor="#b1b1b1"
                          />
                        ) : (
                          <span>{t("common.ok")}</span>
                        )}
                      </ButtonBase>
                    </div>
                    <div className="px-4 mt-3 pb-4">
                      <ButtonWhite status="active" onClick={closeModal}>
                        <span>{t("common.cancel")}</span>
                      </ButtonWhite>
                    </div>
                  </div>
                </form>
              )}
              {activeTab === "register" && (
                <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
                  <div className="rounded-t-lg overflow-hidden">
                    <InputField
                      value={regLogin}
                      onChange={onChangeRegLogin}
                      placeholder={t("common.login")}
                      errMsg={regLoginErr}
                      available={
                        regLogin.length > 2 && regLoginErr === "" ? true : false
                      }
                    />
                  </div>
                  <div>
                    <InputField
                      value={regUsername}
                      onChange={setRegUsername}
                      placeholder={t("common.nickname")}
                      errMsg={regUsernameErr}
                      available={
                        regUsername !== "" && regUsernameErr === ""
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div>
                    <PasswordFiled
                      value={regPwd}
                      onChange={onChangeRegPwd}
                      placeholder={t("common.password")}
                      errMsg={regPwdErr}
                      available={
                        regPwd.length > 5 && regPwdErr === "" ? true : false
                      }
                    />
                  </div>
                  <div>
                    <PasswordFiled
                      value={regConPwd}
                      onChange={onChangeConfirmPwd}
                      placeholder={t("common.confirm_pwd")}
                      errMsg={regConPwdErr}
                      available={
                        regConPwd.length > 5 && regConPwd === regPwd
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div className="bg-white rounded-b-lg overflow-hidden">
                    <div className="pt-5 px-4">
                      <CheckBox value={regAgree} onChange={setRegAgree}>
                        <div
                          className="flex items-center leading-5"
                          style={{ fontSize: "13px" }}
                        >
                          <p className="text-zinc-200">
                            {t("common.agree_with")} &nbsp;
                          </p>
                          <p
                            className="text-sky-600 underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpenRuleModal(true);
                            }}
                          >
                            {t("auth.by_service_rules")}
                          </p>
                        </div>
                      </CheckBox>
                    </div>
                    <div className="px-4 pt-3">
                      <ButtonBase
                        type="submit"
                        status={`${
                          regLogin.length > 2 &&
                          regLoginErr === "" &&
                          regUsername &&
                          regPwd.length > 5 &&
                          regConPwd &&
                          regPwd === regConPwd &&
                          regAgree
                            ? registering
                              ? "disable"
                              : "active"
                            : "disable"
                        }`}
                        onClick={onClickRegister}
                      >
                        {registering ? (
                          <Spinner
                            color="white"
                            size={26}
                            innerColor="#b1b1b1"
                          />
                        ) : (
                          <span>{t("auth.signup")}</span>
                        )}
                      </ButtonBase>
                      <div className="mt-3 pb-4">
                        <ButtonWhite status="active" onClick={closeModal}>
                          <span>{t("common.cancel")}</span>
                        </ButtonWhite>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        {pageState === "code" && (
          <div>
            <div className="w-full flex flex-col items-center  am-gapY-8px rounded-lg border border-gray-50 bg-gray-200 py-4">
              <GuardIcon />
              <p className="text-xl">{t("auth.recovery_code")}</p>
            </div>
            <div className="mt-4 w-full shadow-custom-7 rounded-lg bg-gray-200 flex flex-col am-gapY-2px">
              <div className="bg-white py-2.5 px-4 rounded-t-lg overflow-hidden">
                <div className="text-center font-bold">
                  {t("common.greeting")}
                </div>
                <div className="text-center">
                  {t("auth.recovery_code_description")}
                </div>
              </div>
              <div className="flex justify-between items-start  am-gapX-16px p-4 bg-white">
                <div className="text-wrap">{secretToken}</div>
                <CopyIconButton val={secretToken} />
              </div>
              <div className="px-4 py-5 bg-white rounded-b-lg overflow-hidden">
                <ButtonBase
                  status="active"
                  onClick={() => setPageState("defaultType")}
                >
                  {t("common.continue")}
                </ButtonBase>
              </div>
            </div>
          </div>
        )}
        {pageState === "defaultType" && (
          <div className="shadow-custom-7 rounded-lg">
            <div className="px-4 pb-3 pt-4">
              <DropdownBoxWithSearch1
                list={typeList}
                label={t("auth.select_default_type")}
                onChange={setSelectedType}
                activeItem={selectedType}
                isBlue={true}
                top={10}
                width={32}
                left={-16}
                isCustomWidth={true}
              />
            </div>
            <div
              className="px-4 bg-gray-200 pb-3"
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                paddingTop: "10px",
              }}
            >
              {t("auth.can_change_default_type_later")}
            </div>
            <div className="py-5 px-4">
              <ButtonBase
                status={selectedType ? "active" : "disable"}
                onClick={onClickSelectDefaultType}
              >
                {t("common.continue")}
              </ButtonBase>
            </div>
          </div>
        )}
        {pageState === "resetPwd" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-full flex flex-col items-center am-gapY-8px rounded-lg border border-gray-50 bg-gray-200 py-4">
              <HumanIcon />
              <p className="text-xl">{t("auth.access_recovery")}</p>
            </div>
            <form className="mt-4 w-full shadow-custom-7 rounded-lg bg-gray-200 flex flex-col am-gapY-2px">
              <div className="rounded-t-lg overflow-hidden">
                <InputField
                  value={resetLogin}
                  onChange={setResetLogin}
                  placeholder={t("common.login")}
                  errMsg={resetLoginError}
                />
              </div>
              <InputField
                value={resetSecretToken}
                onChange={setResetSecretToken}
                placeholder={t("auth.recovery_code")}
                errMsg={resetSecretTokenError}
              />
              <PasswordFiled
                value={resetPwd}
                onChange={onChangeResetPwd}
                placeholder={t("auth.new_pwd")}
                errMsg={resetPwdError}
              />
              <PasswordFiled
                value={resetPwdConfirm}
                onChange={onChangeResetPwdConfirm}
                placeholder={t("auth.new_pwd_confirm")}
                errMsg={resetPwdConfirmError}
              />
              <div className="px-4 py-5 rounded-b-lg overflow-hidden flex flex-col am-gapY-12px bg-white">
                <ButtonBase
                  type="submit"
                  onClick={onClickChangePwd}
                  status={
                    resetLogin &&
                    resetSecretToken &&
                    resetPwd &&
                    resetPwd === resetPwdConfirm &&
                    !changing
                      ? "active"
                      : "disable"
                  }
                >
                  {changing ? (
                    <Spinner
                      size={26}
                      width={3}
                      color="white"
                      innerColor="#b1b1b1"
                    />
                  ) : (
                    t("common.ok")
                  )}
                </ButtonBase>
                <ButtonWhite
                  onClick={() => {
                    setPageState("auth");
                    setActiveTab("login");
                    setLoginState("form");
                  }}
                  status="active"
                >
                  {t("common.cancel")}
                </ButtonWhite>
              </div>
            </form>
          </div>
        )}
      </Modal>
      <div
        className={`lg:hidden ${
          isOpen ? "block" : "hidden"
        } fixed w-screen top-0 left-0 bg-white flex justify-center auth-form`}
        style={{ zIndex: 200, height: "100dvh" }}
      >
        <div className="w-full" style={{ maxWidth: "336px" }}>
          {pageState === "auth" && (
            <div>
              <div className="flex justify-center mt-6">
                <Link href="/">
                  <Image width={108} height={24} src={ImgLogo} alt="Logo" />
                </Link>
              </div>
              <div className="mt-12 px-4 grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer text-center text-base leading-8 ${
                    activeTab === "register"
                      ? "text-sky-600 border-b-2 border-sky-600"
                      : ""
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  {t("auth.register")}
                </div>
                <div
                  className={`cursor-pointer text-center text-base leading-8 ${
                    activeTab === "login"
                      ? "text-sky-600 border-b-2 border-sky-600"
                      : ""
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  {t("auth.login")}
                </div>
              </div>
              <div className="mt-4 shadow-custom-7 rounded-lg">
                {activeTab === "login" && loginState === "form" && (
                  <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
                    <div className="rounded-t-lg overflow-hidden">
                      <InputField
                        value={username}
                        onChange={setUsername}
                        placeholder={t("common.login")}
                        errMsg={usernameErr}
                      />
                    </div>
                    <div>
                      <PasswordFiled
                        value={password}
                        onChange={onChangePassword}
                        placeholder={t("common.password")}
                        errMsg={passwordErr}
                      />
                    </div>
                    <div className="bg-white rounded-b-lg overflow-hidden">
                      <div className="px-4 mt-5">
                        <ButtonBase
                          status={`${
                            username.length > 2 && password.length > 5
                              ? logining
                                ? "disable"
                                : "active"
                              : "disable"
                          }`}
                          onClick={onClickLogin}
                        >
                          {logining ? (
                            <Spinner
                              color="white"
                              size={26}
                              innerColor="#b1b1b1"
                            />
                          ) : (
                            <span className={logining ? "hidden" : "block"}>
                              {t("auth.enter")}
                            </span>
                          )}
                        </ButtonBase>
                      </div>
                      <div className="px-4 mt-3">
                        <ButtonWhite status="active" onClick={closeModal}>
                          <span>{t("common.cancel")}</span>
                        </ButtonWhite>
                      </div>
                      <div
                        className="mt-3 text-sky-600 underline leading-8 text-center pb-4 cursor-pointer"
                        style={{ fontSize: "13px" }}
                        onClick={() => setPageState("resetPwd")}
                      >
                        {t("auth.access_recovery")}
                      </div>
                    </div>
                  </form>
                )}
                {activeTab === "login" && loginState === "code" && (
                  <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
                    <div className="rounded-t-lg overflow-hidden">
                      <InputField
                        value={f2acode}
                        onChange={setF2acode}
                        placeholder={t("auth.code_from_google")}
                        errMsg={f2acodeErr}
                        available={f2acode.length === 6}
                      />
                    </div>
                    <div className="bg-white rounded-b-lg overflow-hidden">
                      <div className="px-4 mt-5">
                        <ButtonBase
                          status={`${
                            f2acode.length === 6
                              ? f2aing
                                ? "disable"
                                : "active"
                              : "disable"
                          }`}
                          onClick={onClickF2a}
                        >
                          {f2aing ? (
                            <Spinner
                              color="white"
                              size={26}
                              innerColor="#b1b1b1"
                            />
                          ) : (
                            <span>{t("common.ok")}</span>
                          )}
                        </ButtonBase>
                      </div>
                      <div className="p-4">
                        <ButtonWhite status="active" onClick={closeModal}>
                          <span>{t("common.cancel")}</span>
                        </ButtonWhite>
                      </div>
                    </div>
                  </form>
                )}
                {activeTab === "register" && (
                  <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
                    <div className="rounded-t-lg overflow-hidden">
                      <InputField
                        value={regLogin}
                        onChange={onChangeRegLogin}
                        placeholder={t("common.login")}
                        errMsg={regLoginErr}
                        available={
                          regLogin.length > 2 && regLoginErr === ""
                            ? true
                            : false
                        }
                      />
                    </div>
                    <div>
                      <InputField
                        value={regUsername}
                        onChange={setRegUsername}
                        placeholder={t("common.nickname")}
                        errMsg={regUsernameErr}
                        available={
                          regUsername !== "" && regUsernameErr === ""
                            ? true
                            : false
                        }
                      />
                    </div>
                    <div>
                      <PasswordFiled
                        value={regPwd}
                        onChange={onChangeRegPwd}
                        placeholder={t("auth.password")}
                        errMsg={regPwdErr}
                        available={
                          regPwd.length > 5 && regPwdErr === "" ? true : false
                        }
                      />
                    </div>
                    <div>
                      <PasswordFiled
                        value={regConPwd}
                        onChange={onChangeConfirmPwd}
                        placeholder={t("auth.confirm_pwd")}
                        errMsg={regConPwdErr}
                        available={
                          regConPwd.length > 5 && regConPwdErr === ""
                            ? true
                            : false
                        }
                      />
                    </div>
                    <div className="bg-white rounded-b-lg overflow-hidden">
                      <div className="pt-5 px-4">
                        <CheckBox value={regAgree} onChange={setRegAgree}>
                          <div
                            className="flex items-center leading-5"
                            style={{ fontSize: "13px" }}
                          >
                            <p className="text-zinc-200">
                              {t("common.agree_with")} &nbsp;
                            </p>
                            <p
                              className="text-sky-600 underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpenRuleModal(true);
                              }}
                            >
                              {t("auth.by_servie_rules")}
                            </p>
                          </div>
                        </CheckBox>
                      </div>
                      <div className="px-4 mt-3">
                        <ButtonBase
                          status={`${
                            regLogin.length > 2 &&
                            regLoginErr === "" &&
                            regUsername &&
                            regPwd.length > 5 &&
                            regConPwd &&
                            regPwd === regConPwd &&
                            regAgree
                              ? registering
                                ? "disable"
                                : "active"
                              : "disable"
                          }`}
                          onClick={onClickRegister}
                        >
                          {registering ? (
                            <Spinner
                              color="white"
                              size={26}
                              innerColor="#b1b1b1"
                            />
                          ) : (
                            <span>{t("auth.signup")}</span>
                          )}
                        </ButtonBase>
                      </div>
                      <div className="px-4 mt-3 pb-4">
                        <ButtonWhite status="active" onClick={closeModal}>
                          <span>{t("common.cancel")}</span>
                        </ButtonWhite>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
          {pageState === "code" && (
            <div className="mt-4">
              <div className="w-full flex flex-col items-center am-gapY-8px rounded-lg border border-gray-50 bg-gray-200 py-4">
                <GuardIcon />
                <p className="text-xl">{t("auth.recovery_code")}</p>
              </div>
              <div className="mt-4 w-full shadow-custom-7 rounded-lg bg-gray-200 flex flex-col am-gapY-2px">
                <div className="bg-white py-2.5 px-4 rounded-t-lg overflow-hidden">
                  <div className="text-center font-bold">
                    {t("common.greeting")}
                  </div>
                  <div className="text-center">
                    {t("auth.recovery_code_description")}
                  </div>
                </div>
                <div className="flex justify-between items-start am-gapX-16px p-4 bg-white">
                  <div className="text-wrap">{secretToken}</div>
                  <CopyIconButton val={secretToken} />
                </div>
                <div className="px-4 py-5 bg-white rounded-b-lg overflow-hidden">
                  <ButtonBase
                    status="active"
                    onClick={() => setPageState("defaultType")}
                  >
                    {t("common.continue")}
                  </ButtonBase>
                </div>
              </div>
            </div>
          )}
          {pageState === "defaultType" && (
            <div className="shadow-custom-7 rounded-lg mt-4">
              <div>
                <DropdownBoxWithSearchMobile1
                  list={typeList}
                  label={t("auth.select_default_type")}
                  onChange={setSelectedType}
                  activeItem={selectedType}
                  isBlue={true}
                  hiddenReady={true}
                />
              </div>
              <div
                className="px-4 bg-gray-200 pb-3"
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  paddingTop: "10px",
                }}
              >
                {t("auth.can_change_default_type")}
              </div>
              <div className="py-5 px-4">
                <ButtonBase
                  status={selectedType ? "active" : "disable"}
                  onClick={onClickSelectDefaultType}
                >
                  {t("common.continue")}
                </ButtonBase>
              </div>
            </div>
          )}
          {pageState === "resetPwd" && (
            <div className="flex flex-col items-center w-full">
              <div className="flex justify-center mt-6 mb-8">
                <Link href="/">
                  <Image width={108} height={24} src={ImgLogo} alt="Logo" />
                </Link>
              </div>
              <div className="w-full flex flex-col items-center  am-gapY-8px rounded-lg border border-gray-50 bg-gray-200 py-4">
                <HumanIcon />
                <p className="text-xl">{t("auth.access_recovery")}</p>
              </div>
              <form className="mt-4 w-full shadow-custom-7 rounded-lg bg-gray-200 flex flex-col am-gapY-2px">
                <div className="rounded-t-lg overflow-hidden">
                  <InputField
                    value={resetLogin}
                    onChange={setResetLogin}
                    placeholder={t("common.login")}
                    errMsg={resetLoginError}
                  />
                </div>
                <InputField
                  value={resetSecretToken}
                  onChange={setResetSecretToken}
                  placeholder={t("auth.recovery_code")}
                  errMsg={resetSecretTokenError}
                />
                <PasswordFiled
                  value={resetPwd}
                  onChange={onChangeResetPwd}
                  placeholder={t("auth.new_pwd")}
                  errMsg={resetPwdError}
                />
                <PasswordFiled
                  value={resetPwdConfirm}
                  onChange={onChangeResetPwdConfirm}
                  placeholder={t("auth.new_pwd_recovery")}
                  errMsg={resetPwdConfirmError}
                />
                <div className="px-4 py-5 rounded-b-lg overflow-hidden flex flex-col am-gapY-12px bg-white">
                  <ButtonBase
                    type="submit"
                    onClick={onClickChangePwd}
                    status={
                      resetLogin &&
                      resetSecretToken &&
                      resetPwd &&
                      resetPwd === resetPwdConfirm &&
                      !changing
                        ? "active"
                        : "disable"
                    }
                  >
                    {changing ? (
                      <Spinner
                        size={26}
                        width={3}
                        color="white"
                        innerColor="#b1b1b1"
                      />
                    ) : (
                      t("common.ok")
                    )}
                  </ButtonBase>
                  <ButtonWhite
                    onClick={() => {
                      setPageState("auth");
                      setActiveTab("login");
                      setLoginState("form");
                    }}
                    status="active"
                  >
                    {t("common.cancel")}
                  </ButtonWhite>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
