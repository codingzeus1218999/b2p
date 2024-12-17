"use client";

import {
  ButtonBase,
  ButtonWhite,
  DropdownBoxWithSearch2,
  InputField,
  PasswordFiled,
  Switch,
} from "@/components/Forms";
import { FolderPlusIcon, WarningModalIcon } from "@/components/Icons";
import { CopyIconButton, Skeleton, Spinner } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import {
  accountStatsInterface,
  dropdownItemInterface,
  qrInterface,
} from "@/interfaces";
import ImgNoImg from "@/public/images/no_img.png";
import {
  changeAccountDefaultTypeSize,
  changePassword,
  getAccountDefaultTypeSize,
  getQR,
  getStats,
  terminateSessions,
  twoFactorDisable,
  twoFactorEnable,
  updateImage,
  uploadImage,
} from "@/services/accountsApi";
import { fetchDefaultType, fetchTypes } from "@/services/directoriesApi";
import { getOrders } from "@/services/ordersApi";
import { saveDataInLocalStorage } from "@/utils/calcUtils";
import { mapTypesToDropdownData } from "@/utils/mapUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

const ProfileDesktop: React.FC = () => {
  const [oldPwd, setOldPwd] = useState<string>("");
  const [oldPwdErr, setOldPwdErr] = useState<string>("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [newPwdErr, setNewPwdErr] = useState<string>("");
  const [newConfirmPwd, setNewConfirmPwd] = useState<string>("");
  const [newConfirmPwdErr, setNewConfirmPwdErr] = useState<string>("");
  const [isChangingAvatar, setIsChangingAvatar] = useState<boolean>(false);
  const [isChangingPwd, setIsChangingPwd] = useState<boolean>(false);
  const [isTerminatingSessions, setIsTerminatingSessions] =
    useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [stats, setStats] = useState<accountStatsInterface>();
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [qrInfo, setQRInfo] = useState<qrInterface>();
  const [qrImg, setQRImg] = useState<string>("/images/no_qr.png");
  const [googleCode, setGoogleCode] = useState<string>("");
  const [googleCodeErr, setGoogleCodeErr] = useState<string>("");
  const [isCheckingGoogleCode, setIsCheckingGoogleCode] =
    useState<boolean>(false);
  const [isOpen2FPanel, setIsOpen2FPanel] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [modalState, setModalState] = useState<"session" | "disable" | "code">(
    "session"
  );
  const [disableCode, setDisableCode] = useState<string>("");
  const [disableCodeErr, setDisableCodeErr] = useState<string>("");
  const [isDisabling2F, setIsDisabling2F] = useState<boolean>(false);

  const { user, setUser } = useUser();
  const { setIsLoggedIn } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [orderCount, setOrderCount] = useState<number>(0);
  const [isLoadingInitData, setIsLoadingInitData] = useState<boolean>(false);
  const t = useTranslations();

  useEffect(() => {
    setSwitchState(user.tow_factor);
    getInitData();
    calcWidth();
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);

  const getInitData = async () => {
    setIsLoadingInitData(true);
    try {
      const os = await getOrders(null, 1, 1);
      setOrderCount(os.meta.total);
      const res = await getStats();
      setStats(res);
      const dt = sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const tl = mapTypesToDropdownData(await fetchTypes());
      const qr = await getQR();
      setQRInfo(qr);
      setQRImg(qr.qr_code);
      if (dt) {
        setSelectedType({ value: dt.id, label: dt.title });
      }
      setTypeList(tl);
    } catch (err) {
      console.log("Error getting account stats", err);
    } finally {
      setIsLoadingInitData(false);
    }
  };

  const onChangeType = async (val: dropdownItemInterface) => {
    setSelectedType(val);
    try {
      const res = await changeAccountDefaultTypeSize(val.value);
      setUser({ ...user, default_city: res });
    } catch (err) {
      console.log("Error changing default type", err);
    }
  };

  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const onClickAvatarChange = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsChangingAvatar(true);
      try {
        const res = await uploadImage({
          filename: file.name,
          size: file.size,
          mimetype: file.type,
        });
        const reader = new FileReader();
        reader.onload = async (event: any) => {
          const binaryData = event.target.result;
          const data = await updateImage(res.id, binaryData);
          setUser({ ...user, file: res });
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("Error uploading avatar image", error);
      } finally {
        setIsChangingAvatar(false);
      }
    }
  };

  const onClickChangePassword = async () => {
    setIsChangingPwd(true);
    try {
      const res = await changePassword({
        password: oldPwd,
        new_password: newPwd,
        new_password_confirmation: newConfirmPwd,
      });
      onClickCancelChangePassword();
      showToast(t("profile.pwd_changed"), "success");
    } catch (err: any) {
      console.log("Error change password", err);
      setOldPwdErr(err?.response?.data?.errors?.password ?? "");
    } finally {
      setIsChangingPwd(false);
    }
  };

  const onClickCancelChangePassword = () => {
    setOldPwd("");
    setOldPwdErr("");
    setNewPwd("");
    setNewPwdErr("");
    setNewConfirmPwd("");
    setNewConfirmPwdErr("");
  };

  const onClickTerminateSessions = async () => {
    setIsTerminatingSessions(true);
    try {
      const res = await terminateSessions();
      window.sessionStorage.removeItem("access");
      window.sessionStorage.removeItem("refresh");
      saveDataInLocalStorage(LOCALSTORAGES.FRESHED, true);
      setIsLoggedIn(false);
      router.push("/");
    } catch (err) {
      console.log("Error terminating sessions", err);
    } finally {
      setIsTerminatingSessions(false);
    }
  };

  const onClick2FSwitch = async (val: boolean) => {
    if (val === true) {
      setSwitchState(true);
      setIsOpen2FPanel(true);
    } else {
      if (!user.two_factor) {
        setSwitchState(false);
        setIsOpen2FPanel(false);
      } else {
        setModalState("disable");
        setIsOpenModal(true);
      }
    }
  };

  const onClickTurnOn = async () => {
    setIsCheckingGoogleCode(true);
    try {
      const res = await twoFactorEnable(qrInfo?.secret ?? "", googleCode);
      setUser({ ...user, two_factor: true });
      showToast(t("profile.two_factor_on"), "info");
      setIsOpen2FPanel(false);
    } catch (err: any) {
      console.log("Error enable two factor", err);
      setGoogleCodeErr(err?.response?.data?.errors?.code ?? "");
    } finally {
      setIsCheckingGoogleCode(false);
    }
  };

  const disable2F = async () => {
    setIsDisabling2F(true);
    try {
      const res = await twoFactorDisable(disableCode);
      setUser({ ...user, two_factor: false });
      setIsOpenModal(false);
      showToast(t("profile.two_factor_off"), "warning");
    } catch (err: any) {
      console.log("Error disable two factor", err);
      setDisableCodeErr(err?.response?.data?.errors?.code ?? "");
    } finally {
      setIsDisabling2F(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
        style={{
          content: {
            width: screenWidth > 1023 ? "352px" : "calc(100% - 32px)",
            borderRadius: "8px",
            height: "min-content",
            background: "white",
            margin: screenWidth > 1023 ? "auto" : "auto 16px",
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
        <div className="text-center">
          <WarningModalIcon className="mx-auto mb-10px" />
          {modalState === "session" && (
            <>
              <p className="font-semibold">{t("common.attention")}</p>
              <p>{t("profile.session_terminate")}</p>
              <div className="mt-4">
                <ButtonBase
                  onClick={onClickTerminateSessions}
                  status={isTerminatingSessions ? "disable" : "active"}
                >
                  {isTerminatingSessions ? (
                    <Spinner color="white" size={26} innerColor="#b1b1b1" />
                  ) : (
                    <span>{t("common.decided")}</span>
                  )}
                </ButtonBase>
              </div>
              <div className="mt-3"></div>
              <ButtonWhite
                status="active"
                onClick={() => setIsOpenModal(false)}
              >
                {t("common.cancel")}
              </ButtonWhite>
            </>
          )}
          {modalState === "disable" && (
            <>
              <p className="font-semibold">{t("common.attention")}</p>
              <p>{t("profile.will_two_factor_off")}</p>
              <div className="mt-4">
                <ButtonBase
                  onClick={() => {
                    setModalState("code");
                  }}
                  status="active"
                >
                  {t("common.disable")}
                </ButtonBase>
              </div>
              <div className="mt-3"></div>
              <ButtonWhite
                status="active"
                onClick={() => setIsOpenModal(false)}
              >
                {t("common.cancel")}
              </ButtonWhite>
            </>
          )}
          {modalState === "code" && (
            <>
              <p className="font-semibold">{t("profile.enter_code")}</p>
              <div className="mt-10px"></div>
              <InputField
                placeholder=""
                errMsg={disableCodeErr}
                value={disableCode}
                onChange={(val) => {
                  setDisableCode(val);
                  setDisableCodeErr("");
                }}
                available={disableCode.length === 6 && !disableCodeErr}
              />
              <div className="mt-4"></div>
              <ButtonBase
                status={
                  disableCode.length === 6 && !isDisabling2F
                    ? "active"
                    : "disable"
                }
                onClick={disable2F}
              >
                {isDisabling2F ? (
                  <Spinner size={26} color="white" innerColor="#b1b1b1" />
                ) : (
                  <span>{t("common.ready")}</span>
                )}
              </ButtonBase>
            </>
          )}
        </div>
      </Modal>
      <div className="mt-8">
        <p className="p-4 text-2xl font-semibold">{t("profile.setting")}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="pt-2 pb-4 bg-white rounded-lg shadow-custom-1 h-fit">
            <div className="py-3 flex justify-center">
              <img
                width={76}
                height={76}
                src={user?.file?.path ?? ImgNoImg}
                alt={user?.username ?? ""}
                className="rounded-full w-76px h-76px object-cover cursor-pointer"
                onClick={onClickAvatarChange}
              />
            </div>
            <div className="px-4 pb-2">
              <ButtonWhite
                status={isChangingAvatar ? "disable" : "active"}
                onClick={onClickAvatarChange}
              >
                {isChangingAvatar ? (
                  <Spinner size={26} color="blue" innerColor="white" />
                ) : (
                  <div className="flex items-center am-gapX-10px">
                    <FolderPlusIcon />
                    <span>{t("profile.upload_image")}</span>
                  </div>
                )}
              </ButtonWhite>
              <input
                className="hidden"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="px-4 h-px w-full bg-gray-70"></div>
            <p style={{ padding: "18px 0px 14px 32px" }}>{user.username}</p>
            <div className="px-4">
              <div
                className="bg-gray-200 w-full"
                style={{ height: "2px" }}
              ></div>
              <PasswordFiled
                value={oldPwd}
                placeholder={t("profile.old_pwd")}
                onChange={(v) => {
                  setOldPwd(v);
                  if (v.length < 6) {
                    setOldPwdErr(t("auth.short_pwd_err"));
                  } else {
                    setOldPwdErr("");
                  }
                }}
                errMsg={oldPwdErr}
              />
              <div
                className="bg-gray-200 w-full"
                style={{ height: "2px" }}
              ></div>
              <PasswordFiled
                value={newPwd}
                placeholder={t("auth.new_pwd")}
                onChange={(v) => {
                  setNewPwd(v);
                  if (v.length < 6) {
                    setNewPwdErr(t("auth.short_pwd_err"));
                  } else {
                    setNewPwdErr("");
                  }
                }}
                errMsg={newPwdErr}
              />
              <div
                className="bg-gray-200 w-full"
                style={{ height: "2px" }}
              ></div>
              <PasswordFiled
                value={newConfirmPwd}
                placeholder={t("auth.new_pwd_confirm")}
                onChange={(v) => {
                  setNewConfirmPwd(v);
                  setNewConfirmPwdErr(
                    newPwd === v ? "" : t("auth.not_match_pwd_err")
                  );
                }}
                errMsg={newConfirmPwdErr}
              />
              <div
                className="bg-gray-200 w-full"
                style={{ height: "2px" }}
              ></div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <ButtonBase
                  status={
                    oldPwd &&
                    newPwd &&
                    newConfirmPwd &&
                    !oldPwdErr &&
                    !newPwdErr &&
                    !newConfirmPwdErr &&
                    !isChangingPwd
                      ? "active"
                      : "disable"
                  }
                  onClick={onClickChangePassword}
                >
                  {isChangingPwd ? (
                    <Spinner size={26} color="white" innerColor="#b1b1b1" />
                  ) : (
                    <span>{t("common.save")}</span>
                  )}
                </ButtonBase>
                <ButtonWhite
                  status="active"
                  onClick={onClickCancelChangePassword}
                >
                  {t("common.cancel")}
                </ButtonWhite>
              </div>
            </div>
          </div>
          <div className="flex flex-col am-gapY-16px">
            <div className="grid grid-cols-3 gap-3">
              <div
                className="p-3 rounded-xl border border-sky-50 flex flex-col justify-between"
                style={{ height: "76px" }}
              >
                <p className="text-xs leading-14px">{t("profile.shopping")}</p>
                {isLoadingInitData ? (
                  <Skeleton className="rounded-md h-5 w-8" />
                ) : (
                  <p className="font-medium text-xl leading-5">{orderCount}</p>
                )}
              </div>
              <div
                className="p-3 rounded-xl border border-sky-50 flex flex-col justify-between"
                style={{ height: "76px" }}
              >
                <p className="text-xs leading-14px">{t("profile.tickets")}</p>
                {isLoadingInitData ? (
                  <Skeleton className="rounded-md h-5 w-8" />
                ) : (
                  <p className="font-medium text-xl leading-5">
                    {stats?.discussion ?? 0}
                  </p>
                )}
              </div>
              <div
                className="p-3 rounded-xl border border-sky-50 flex flex-col justify-between"
                style={{ height: "76px" }}
              >
                <p className="text-xs leading-14px">
                  {t("profile.active_tickets")}
                </p>
                {isLoadingInitData ? (
                  <Skeleton className="rounded-md h-5 w-8" />
                ) : (
                  <p className="font-medium text-xl leading-5">
                    {stats?.open_discussion ?? 0}
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-lg p-4 shadow-custom-1">
              <DropdownBoxWithSearch2
                label={t("auth.select_default_type")}
                list={typeList}
                activeItem={selectedType}
                onChange={onChangeType}
              />
              <div className="mt-2 bg-sky-50 rounded-xl h-11 px-4 flex justify-between items-center">
                <p
                  className={`${
                    switchState ? "text-sky-600" : ""
                  } text-sm leading-4`}
                >
                  {t("profile.two_factor")}
                </p>
                <Switch on={switchState} onChange={onClick2FSwitch} />
              </div>
              <div className={classNames("mt-2", { hidden: !isOpen2FPanel })}>
                <div className="px-4 py-3">
                  <img
                    src={qrImg}
                    alt="qr code"
                    style={{ width: "128px", height: "128px" }}
                    width={128}
                    height={128}
                    onError={() => setQRImg("/images/no_qr.png")}
                  />
                  <p className="mt-10px">{t("profile.scan_qr")}</p>
                </div>
                <div className="my-2 h-px w-full bg-gray-70"></div>
                <div
                  style={{ padding: "18px 16px 14px 16px" }}
                  className="flex am-gapX-8px items-center"
                >
                  <p className="font-semibold">{t("common.key")} </p>
                  <p>{qrInfo?.secret ?? ""}</p>
                  <CopyIconButton val={qrInfo?.secret ?? ""} />
                </div>
                <div className="my-2 h-px w-full bg-gray-70"></div>
                <InputField
                  placeholder={t("auth.code_from_google")}
                  errMsg={googleCodeErr}
                  value={googleCode}
                  onChange={(val) => {
                    setGoogleCode(val);
                    setGoogleCodeErr("");
                  }}
                  available={googleCode.length === 6 && !googleCodeErr}
                />
                <div className="my-2 h-px w-full bg-gray-70"></div>
                <ButtonBase
                  status={googleCode.length === 6 ? "active" : "disable"}
                  onClick={() => {
                    if (isCheckingGoogleCode) return;
                    else onClickTurnOn();
                  }}
                >
                  {isCheckingGoogleCode ? (
                    <Spinner size={26} color="white" innerColor="#1976D2" />
                  ) : (
                    <span>{t("common.connect")}</span>
                  )}
                </ButtonBase>
              </div>
            </div>
            <div className="shadow-custom-1 p-4 rounded-lg">
              <ButtonWhite
                status="active"
                onClick={() => {
                  setModalState("session");
                  setIsOpenModal(true);
                }}
              >
                {t("profile.terminate_sessions")}
              </ButtonWhite>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDesktop;
