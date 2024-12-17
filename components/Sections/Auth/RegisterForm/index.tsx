"use client";

import {
  ButtonBase,
  CheckBox,
  InputField,
  PasswordFiled,
} from "@/components/Forms";
import { Spinner } from "@/components/Units";
import { RegisterFormProps } from "@/interfaces";
import { check } from "@/services/accountsApi";
import { getRules } from "@/services/instructionsApi";
import { recoveryToken, signup } from "@/services/signsApi";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Modal from "react-modal";

const RegisterForm: React.FC<RegisterFormProps> = ({ callbackFunc }) => {
  const [login, setLogin] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);
  const [rules, setRules] = useState<string>("");
  const [isOpenRuleModal, setIsOpenRuleModal] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const t = useTranslations();

  useEffect(() => {
    getInitData();
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);

  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const getInitData = async () => {
    try {
      const rl = await getRules();
      setRules(rl);
    } catch (err) {
      console.log("Error fetching the initial data", err);
    }
  };

  const onChangeLogin = async (val: string) => {
    setLogin(val);
    setLoginError("");
    if (val.length < 4) return;
    try {
      const res = await check(val);
      setLoginError("");
    } catch (err: any) {
      if (err.response.status === 409) {
        setLoginError(t("auth.double_login_err"));
      }
    }
  };

  const onChangePassword = (val: string) => {
    setPassword(val);
    if (val.length < 6) {
      setPasswordError(t("auth.short_pwd_err"));
    } else {
      setPasswordError("");
    }
  };

  const onChangePasswordConfirm = (val: string) => {
    setPasswordConfirm(val);
    setPasswordConfirmError(
      password === val ? "" : t("auth.not_match_pwd_err")
    );
  };

  const onClickRegister = async () => {
    setLoginError("");
    setUsernameError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setRegistering(true);
    try {
      const res = await signup(login, username, password, passwordConfirm);
      const st = await recoveryToken();
      callbackFunc(st);
    } catch (err: any) {
      console.log(err);
      setLoginError(err?.response?.data?.errors?.login);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpenRuleModal}
        onRequestClose={() => setIsOpenRuleModal(false)}
        style={{
          content: {
            width: screenWidth > 1023 ? "536px" : "calc(100% - 32px)",
            borderRadius: "8px",
            height: "min-content",
            maxHeight: "calc(100% - 32px)",
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
            zIndex: 300,
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
            setAgree(true);
            setIsOpenRuleModal(false);
          }}
          status="active"
        >
          {t("common.accept")}
        </ButtonBase>
      </Modal>
      <div className="shadow-custom-7 rounded-lg">
        <form className="flex flex-col bg-gray-200 rounded-lg am-gapY-2px">
          <div className="rounded-t-lg overflow-hidden">
            <InputField
              value={login}
              onChange={onChangeLogin}
              placeholder={t("common.login")}
              errMsg={loginError}
              available={login.length > 2 && loginError === "" ? true : false}
            />
          </div>
          <InputField
            value={username}
            onChange={setUsername}
            placeholder={t("common.nickname")}
            errMsg={usernameError}
            available={username !== "" && usernameError === "" ? true : false}
          />
          <PasswordFiled
            value={password}
            onChange={onChangePassword}
            placeholder={t("common.password")}
            errMsg={passwordError}
            available={
              password.length > 5 && passwordError === "" ? true : false
            }
          />
          <PasswordFiled
            value={passwordConfirm}
            onChange={onChangePasswordConfirm}
            placeholder={t("auth.confirm_pwd")}
            errMsg={passwordConfirmError}
            available={
              passwordConfirm.length > 5 && passwordConfirm === password
                ? true
                : false
            }
          />
          <div className="py-5 px-4 rounded-b-lg overflow-hidden bg-white">
            <CheckBox value={agree} onChange={setAgree}>
              <div
                className="flex items-center leading-5"
                style={{ fontSize: "13px" }}
              >
                <p className="text-zinc-200">Соглашаюсь с &nbsp;</p>
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
            <div className="mt-4">
              <ButtonBase
                type="submit"
                status={`${
                  login.length > 2 &&
                  loginError === "" &&
                  username &&
                  password.length > 5 &&
                  passwordConfirm &&
                  password === passwordConfirm &&
                  agree
                    ? registering
                      ? "disable"
                      : "active"
                    : "disable"
                }`}
                onClick={onClickRegister}
              >
                {registering ? (
                  <Spinner
                    width={3}
                    color="white"
                    size={26}
                    innerColor="#b1b1b1"
                  />
                ) : (
                  <span>{t("auth.signup")}</span>
                )}
              </ButtonBase>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
