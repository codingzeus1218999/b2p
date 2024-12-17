"use client";

import { ButtonBase, InputField, PasswordFiled } from "@/components/Forms";
import { Spinner } from "@/components/Units";
import { LoginFormProps } from "@/interfaces";
import { login } from "@/services/signsApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginForm: React.FC<LoginFormProps> = ({ redirectUrl, callbackFunc }) => {
  const [username, setUsername] = useState<string>("");
  const [usernameErr, setUsernameErr] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");
  const [logining, setLogining] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();

  const onChangePassword = (val: string) => {
    setPassword(val);
    if (val.length < 6) {
      setPasswordErr(t("auth.short_pwd_err"));
    } else {
      setPasswordErr("");
    }
  };

  const onClickLogin = async () => {
    setUsernameErr("");
    setPasswordErr("");
    setLogining(true);
    try {
      const res = await login(username, password);
      if (res?.two_factor && callbackFunc) {
        callbackFunc(res.auth_token);
      } else {
        router.push(redirectUrl ? "/" + redirectUrl : "/");
      }
    } catch (err: any) {
      setUsernameErr(err?.response?.data?.errors?.login);
      setPasswordErr(err?.response?.data?.errors?.password);
      setLogining(false);
    }
  };

  return (
    <div className="shadow-custom-7 rounded-lg">
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
        <div className="px-4 py-5 bg-white rounded-b-lg overflow-hidden">
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
              <Spinner width={3} size={26} color="white" innerColor="#b1b1b1" />
            ) : (
              <span>{t("auth.enter")}</span>
            )}
          </ButtonBase>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
