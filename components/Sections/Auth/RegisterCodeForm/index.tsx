"use client";

import { ButtonBase } from "@/components/Forms";
import { GuardIcon } from "@/components/Icons";
import { CopyIconButton } from "@/components/Units";
import { RegisterCodeFormProps } from "@/interfaces";
import { useTranslations } from "next-intl";

const RegisterCodeForm: React.FC<RegisterCodeFormProps> = ({
  token,
  onClick,
}) => {
  const t = useTranslations();
  return (
    <>
      <div className="w-full flex flex-col items-center am-gapY-8px rounded-lg border border-gray-50 bg-gray-200 py-4">
        <GuardIcon />
        <p className="text-xl">{t("auth.recovery_code")}</p>
      </div>
      <div className="mt-4 w-full shadow-custom-7 rounded-lg bg-gray-200 flex flex-col am-gapY-2px">
        <div className="bg-white py-2.5 px-4 rounded-t-lg overflow-hidden">
          <div className="text-center font-bold">{t("common.greeting")}</div>
          <div className="text-center">
            {t("auth.recovery_code_description")}
          </div>
        </div>
        <div className="flex justify-between items-start am-gapX-16px p-4 bg-white">
          <div className="text-wrap">{token}</div>
          <CopyIconButton val={token} />
        </div>
        <div className="px-4 py-5 bg-white border-b-8 overflow-hidden">
          <ButtonBase status="active" onClick={onClick}>
            {t("common.continue")}
          </ButtonBase>
        </div>
      </div>
    </>
  );
};

export default RegisterCodeForm;
