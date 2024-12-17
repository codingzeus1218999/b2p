"use client";

import {
  ButtonBase,
  ButtonWhite,
  InputField,
  PasswordFiled,
} from "@/components/Forms";
import { HumanIcon } from "@/components/Icons";
import { Spinner } from "@/components/Units";
import { ResetPwdFormProps } from "@/interfaces";
import { resetPassword } from "@/services/signsApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";

const ResetPwdForm: React.FC<ResetPwdFormProps> = ({
  redirectUrl,
  onClickCancel,
  callbackFunc,
}) => {
  const [login, setLogin] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [secretToken, setSecretToken] = useState<string>("");
  const [secretTokenError, setSecretTokenError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");
  const [changing, setChanging] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();

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

  const onClickChangePwd = async () => {
    setChanging(true);
    try {
      const res = await resetPassword(
        login,
        secretToken,
        password,
        passwordConfirm
      );
      if (res?.two_factor && callbackFunc) {
        callbackFunc(res.auth_token);
      } else {
        router.push(redirectUrl ? "/" + redirectUrl : "/");
      }
    } catch (err: any) {
      console.log("Error chaning password", err);
      setSecretTokenError(err?.response?.data?.errors?.secret_token);
      setLoginError(err?.response?.data?.errors?.login);
    } finally {
      setChanging(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center am-gapY-8px rounded-lg border border-gray-50 bg-gray-200 py-4">
        <HumanIcon />
        <p className="text-xl">Восстановление доступа</p>
      </div>
      <form className="mt-4 w-full shadow-custom-7 rounded-lg bg-gray-200 flex flex-col am-gapY-2px">
        <div className="rounded-t-lg overflow-hidden">
          <InputField
            value={login}
            onChange={setLogin}
            placeholder={t("common.login")}
            errMsg={loginError}
          />
        </div>
        <InputField
          value={secretToken}
          onChange={setSecretToken}
          placeholder={t("auth.recovery_code")}
          errMsg={secretTokenError}
        />
        <PasswordFiled
          value={password}
          onChange={onChangePassword}
          placeholder={t("auth.new_pwd")}
          errMsg={passwordError}
        />
        <PasswordFiled
          value={passwordConfirm}
          onChange={onChangePasswordConfirm}
          placeholder={t("auth.new_pwd_confirm")}
          errMsg={passwordConfirmError}
        />
        <div className="px-4 py-5 rounded-b-lg overflow-hidden flex flex-col am-gapY-12px bg-white">
          <ButtonBase
            type="submit"
            onClick={onClickChangePwd}
            status={
              login &&
              secretToken &&
              password &&
              password === passwordConfirm &&
              !changing
                ? "active"
                : "disable"
            }
          >
            {changing ? (
              <Spinner size={26} width={3} color="white" innerColor="#b1b1b1" />
            ) : (
              "Ok"
            )}
          </ButtonBase>
          <ButtonWhite onClick={onClickCancel} status="active">
            {t("common.cancel")}
          </ButtonWhite>
        </div>
      </form>
    </>
  );
};

export default ResetPwdForm;
