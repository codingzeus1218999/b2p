"use client";

import { ButtonBase, InputField } from "@/components/Forms";
import { Spinner } from "@/components/Units";
import { LoginCodeFormProps } from "@/interfaces";
import { checkf2a } from "@/services/signsApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";

const LoginCodeForm: React.FC<LoginCodeFormProps> = ({
  redirectUrl,
  authToken,
}) => {
  const t = useTranslations();
  const [f2acode, setF2acode] = useState<string>("");
  const [f2acodeErr, setF2acodeErr] = useState<string>("");
  const [f2aing, setF2aing] = useState<boolean>(false);
  const router = useRouter();

  const onClickF2a = async () => {
    setF2aing(true);
    setF2acodeErr("");
    try {
      const res = await checkf2a(f2acode, authToken);
      router.push(redirectUrl ? "/" + redirectUrl : "/");
    } catch (err: any) {
      console.log("Error 2 factor auth", err);
      setF2acodeErr(err?.response?.data?.errors?.code);
    } finally {
      setF2aing(false);
    }
  };

  return (
    <div className="shadow-custom-7 rounded-lg">
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
        <div className="px-4 py-5 bg-white rounded-b-lg overflow-hidden">
          <ButtonBase
            type="submit"
            status={`${
              f2acode.length === 6 ? (f2aing ? "disable" : "active") : "disable"
            }`}
            onClick={onClickF2a}
          >
            {f2aing ? (
              <Spinner width={3} color="white" size={26} innerColor="#b1b1b1" />
            ) : (
              <span>Ок</span>
            )}
          </ButtonBase>
        </div>
      </form>
    </div>
  );
};

export default LoginCodeForm;
