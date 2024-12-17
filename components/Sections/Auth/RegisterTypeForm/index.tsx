"use client";

import {
  ButtonBase,
  DropdownBoxWithSearch1,
  DropdownBoxWithSearchMobile1,
} from "@/components/Forms";
import { RegisterTypeFormProps, dropdownItemInterface } from "@/interfaces";
import { changeAccountDefaultTypeSize } from "@/services/accountsApi";
import { fetchTypes } from "@/services/directoriesApi";
import { mapTypesToDropdownData } from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RegisterTypeForm: React.FC<RegisterTypeFormProps> = ({
  redirectUrl,
  callbackFunc,
}) => {
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (): Promise<void> => {
    try {
      const tl = mapTypesToDropdownData(await fetchTypes());
      setTypeList(tl);
    } catch (err) {
      console.log("Error fetching the initial data");
    }
  };

  const onClickSelectDefaultType = async () => {
    if (!selectedType) return;
    try {
      const res = await changeAccountDefaultTypeSize(selectedType?.value);
      if (window.innerWidth > 1023) {
        router.push(redirectUrl ? "/" + redirectUrl : "/");
      } else if (callbackFunc) {
        callbackFunc();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="shadow-custom-7 rounded-lg">
      <div className="hidden lg:block px-4 pb-3" style={{ paddingTop: "18px" }}>
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
      <div className="block lg:hidden -mb-2">
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
        {t("auth.can_cange_default_type_later")}
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
  );
};

export default RegisterTypeForm;
