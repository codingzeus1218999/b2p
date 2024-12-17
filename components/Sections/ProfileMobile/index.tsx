"use client";

import {
  ButtonBase,
  ButtonMedium,
  ButtonWhite,
  CodeInput,
  DropdownBoxWithSearchMobile2,
  PasswordFieldMobile,
  Switch,
} from "@/components/Forms";
import {
  ClockIcon,
  RightIcon,
  TopupIcon,
  WarningModalIcon,
} from "@/components/Icons";
import { CopyIconButton, Skeleton, Spinner } from "@/components/Units";
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
import { getCoupons } from "@/services/catalogsApi";
import { fetchDefaultType, fetchTypes } from "@/services/directoriesApi";
import { getOrders } from "@/services/ordersApi";
import { mapTypesToDropdownData } from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

const useSwipeToClose = (closeHandler: () => void) => {
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
    };

    const onTouchEnd = () => {
      if (touchEndY - touchStartY > 50) {
        closeHandler();
      }
    };

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [closeHandler]);
};

const ProfileMobile: React.FC = () => {
  const t = useTranslations();
  const [oldPwd, setOldPwd] = useState<string>("");
  const [oldPwdErr, setOldPwdErr] = useState<string>("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [newPwdErr, setNewPwdErr] = useState<string>("");
  const [newConfirmPwd, setNewConfirmPwd] = useState<string>("");
  const [newConfirmPwdErr, setNewConfirmPwdErr] = useState<string>("");
  const [isChangingPwd, setIsChangingPwd] = useState<boolean>(false);
  const [isTerminatingSessions, setIsTerminatingSessions] =
    useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [stats, setStats] = useState<accountStatsInterface>();
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const [qrInfo, setQRInfo] = useState<qrInterface>();
  const [googleCodeErr, setGoogleCodeErr] = useState<string>("");
  const [isCheckingGoogleCode, setIsCheckingGoogleCode] =
    useState<boolean>(false);

  const [disableCodeErr, setDisableCodeErr] = useState<string>("");
  const [isDisabling2F, setIsDisabling2F] = useState<boolean>(false);
  const [isOpenTerminateModal, setIsOpenTerminateModal] =
    useState<boolean>(false);
  const [isOpenPwdModal, setIsOpenPwdModal] = useState<boolean>(false);
  const [isOpen2FEnableModal, setIsOpen2FEnableModal] =
    useState<boolean>(false);
  const [isOpen2FDisableModal, setIsOpen2FDisableModal] =
    useState<boolean>(false);
  const [updatedEnable, setUpdatedEnable] = useState<number>(0);
  const [updatedDisable, setUpdatedDisable] = useState<number>(0);
  const [couponsCount, setCouponsCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const { showToast } = useToast();
  const { user, setUser } = useUser();
  const { setIsLoggedIn } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoadingInitData, setIsLoadingInitData] = useState<boolean>(false);

  useSwipeToClose(() => setIsOpenTerminateModal(false));
  useSwipeToClose(() => setIsOpenPwdModal(false));
  useSwipeToClose(() => setIsOpen2FEnableModal(false));
  useSwipeToClose(() => setIsOpen2FDisableModal(false));

  useEffect(() => {
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
      const res = await getStats();
      setStats(res);
      const dt = sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const tl = mapTypesToDropdownData(await fetchTypes());
      const qr = await getQR();
      const coupons = await getCoupons(1, 1);
      const orders = await getOrders(null, 1, 1);
      setCouponsCount(coupons.meta.total);
      setOrdersCount(orders.meta.total);
      setQRInfo(qr);
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
    setIsOpenPwdModal(false);
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
      showToast(t("profile.session_terminated"), "info");
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
      setIsOpen2FEnableModal(true);
    } else {
      setIsOpen2FDisableModal(true);
    }
  };

  const onCompleteGoogleCode = async (val: string) => {
    setIsCheckingGoogleCode(true);
    try {
      const res = await twoFactorEnable(qrInfo?.secret ?? "", val);
      setUser({ ...user, two_factor: true });
      showToast(t("profile.two_factor_on"), "info");
      setIsOpen2FEnableModal(false);
    } catch (err: any) {
      console.log("Error enable two factor", err);
      setGoogleCodeErr(err?.response?.data?.errors?.code ?? "");
      setUpdatedEnable((prev) => prev + 1);
    } finally {
      setIsCheckingGoogleCode(false);
    }
  };

  const onCompleteDisableCode = async (val: string) => {
    setIsDisabling2F(true);
    try {
      const res = await twoFactorDisable(val);
      setUser({ ...user, two_factor: false });
      showToast(t("profile.two_factor_off"), "warning");
      setIsOpen2FDisableModal(false);
    } catch (err: any) {
      console.log("Error disable two factor", err);
      setDisableCodeErr(err?.response?.data?.errors?.code ?? "");
      setUpdatedDisable((prev) => prev + 1);
    } finally {
      setIsDisabling2F(false);
    }
  };

  const onClickVPN = () => {
    router.push("/profile/vpn");
  };

  const onClickTopUp = () => {
    router.push("/payment");
  };

  const onClickHistory = () => {
    router.push("/balance");
  };

  const onClickOrder = () => {
    router.push("/orders");
  };

  const onClickPromoCode = () => {
    router.push("/coupons");
  };

  const onClickAvatarChange = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
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
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpenTerminateModal}
        onRequestClose={() => setIsOpenTerminateModal(false)}
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
            onClick={() => setIsOpenTerminateModal(false)}
          >
            {t("common.cancel")}
          </ButtonWhite>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenPwdModal}
        onRequestClose={() => setIsOpenPwdModal(false)}
        style={{
          content: {
            width: "100%",
            borderRadius: "8px 8px 0 0",
            height: "min-content",
            background: "white",
            margin: "auto 0 0 0",
            padding: "8px 16px 16px 16px",
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
        <div>
          <div
            className="h-1 w-9 bg-zinc-100 mx-auto"
            style={{ borderRadius: "2.5px" }}
          ></div>
          <p className="mt-3 font-semibold text-center">
            {t("profile.change_pwd")}
          </p>
          <div className="mt-5">
            <PasswordFieldMobile
              value={oldPwd}
              placeholder={t("profile.current_pwd")}
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
          </div>
          <div className="mt-2">
            <PasswordFieldMobile
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
          </div>
          <div className="mt-2">
            <PasswordFieldMobile
              value={newConfirmPwd}
              placeholder={t("profile.repeat_new_pwd")}
              onChange={(v) => {
                setNewConfirmPwd(v);
                setNewConfirmPwdErr(
                  newPwd === v ? "" : t("auth.not_match_pwd_err")
                );
              }}
              errMsg={newConfirmPwdErr}
              available={
                newConfirmPwd !== "" &&
                newConfirmPwd === newPwd &&
                !newConfirmPwdErr
              }
            />
          </div>
          <div className="mt-5">
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
          </div>
          <div className="mt-3">
            <ButtonWhite status="active" onClick={onClickCancelChangePassword}>
              {t("common.cancel")}
            </ButtonWhite>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isOpen2FEnableModal}
        onRequestClose={() => setIsOpen2FEnableModal(false)}
        style={{
          content: {
            width: "100%",
            borderRadius: "8px 8px 0 0",
            height: "min-content",
            background: "white",
            margin: "auto 0 0 0",
            padding: "8px 16px 16px 16px",
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
        <div>
          <div
            className="h-1 w-9 bg-zinc-100 mx-auto"
            style={{ borderRadius: "2.5px" }}
          ></div>
          <p className="mt-3 font-semibold text-center">
            {t("profile.enable_two_factor")}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <p>{t("common.key")}</p>
            <p className="font-semibold text-sky-600 flex-1 mx-2">
              {qrInfo?.secret ?? ""}
            </p>
            <CopyIconButton val={qrInfo?.secret ?? ""} />
          </div>
          <p className="mt-4 leading-4">{t("auth.code_from_google")}: </p>
          <div className="mt-3">
            <CodeInput
              length={6}
              onComplete={onCompleteGoogleCode}
              error={googleCodeErr}
              updated={updatedEnable}
            />
          </div>
          <div className="mt-5">
            <ButtonWhite
              status={isCheckingGoogleCode ? "disable" : "active"}
              onClick={() => setIsOpen2FEnableModal(false)}
            >
              {isCheckingGoogleCode ? (
                <Spinner size={26} color="blue" innerColor="white" />
              ) : (
                <span>{t("common.cancel")}</span>
              )}
            </ButtonWhite>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isOpen2FDisableModal}
        onRequestClose={() => setIsOpen2FDisableModal(false)}
        style={{
          content: {
            width: "100%",
            borderRadius: "8px 8px 0 0",
            height: "min-content",
            background: "white",
            margin: "auto 0 0 0",
            padding: "8px 16px 16px 16px",
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
        <div>
          <div
            className="h-1 w-9 bg-zinc-100 mx-auto"
            style={{ borderRadius: "2.5px" }}
          ></div>
          <WarningModalIcon className="mx-auto" />
          <p className="mt-4 font-semibold text-center">
            {t("profile.will_two_factor_off")}
          </p>
          <p className="mt-5">{t("auth.code_from_google")}: </p>
          <div className="mt-3">
            <CodeInput
              length={6}
              onComplete={onCompleteDisableCode}
              error={disableCodeErr}
              updated={updatedDisable}
            />
          </div>
          <div className="mt-5">
            <ButtonWhite
              status={isDisabling2F ? "disable" : "active"}
              onClick={() => setIsOpen2FDisableModal(false)}
            >
              {isDisabling2F ? (
                <Spinner size={26} color="blue" innerColor="white" />
              ) : (
                <span>{t("common.cancel")}</span>
              )}
            </ButtonWhite>
          </div>
        </div>
      </Modal>
      <div className="px-4 py-3 flex items-center">
        <Image
          width={40}
          height={40}
          src={user?.file?.path ?? ImgNoImg}
          alt={user?.username ?? ""}
          className="rounded-full w-10 h-10 object-cover cursor-pointer mr-2"
          onClick={onClickAvatarChange}
        />
        <input
          className="hidden"
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />
        <p className="text-2xl font-semibold">{user.username}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 px-4">
        <div
          className="p-3 rounded-xl border border-sky-50 flex flex-col justify-between"
          style={{ height: "76px" }}
        >
          <p className="text-xs leading-14px">{t("profile.shopping")}</p>
          {isLoadingInitData ? (
            <Skeleton className="rounded-md h-5 w-8" />
          ) : (
            <p className="font-medium text-xl leading-5">{ordersCount}</p>
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
          <p className="text-xs leading-14px">{t("profile.active_tickets")}</p>
          {isLoadingInitData ? (
            <Skeleton className="rounded-md h-5 w-8" />
          ) : (
            <p className="font-medium text-xl leading-5">
              {stats?.open_discussion ?? 0}
            </p>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="p-3 bg-gray-100 rounded-xl">
          <div className="flex font-semibold text-2xl items-center">
            <p className="mr-2">{t("common.balance")}:</p>
            {isLoadingInitData ? (
              <Skeleton className="rounded-md h-7 w-16" />
            ) : (
              <p className="text-sky-600">
                {Number(user.balance).toLocaleString("ru-RU")} ₽
              </p>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ButtonMedium
              status="active"
              style="primary"
              onClick={onClickTopUp}
            >
              <div className="flex items-center">
                <TopupIcon />
                <span className="ml-2">{t("common.topup")}</span>
              </div>
            </ButtonMedium>
            <ButtonMedium
              status="active"
              style="secondary"
              onClick={onClickHistory}
            >
              <div className="flex items-center">
                <ClockIcon />
                <span className="ml-2">{t("common.history")}</span>
              </div>
            </ButtonMedium>
          </div>
        </div>
      </div>
      <div className="px-4 pt-5 pb-3 text-xl leading-5 font-semibold">
        Покупки
      </div>
      <div
        onClick={onClickOrder}
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px cursor-pointer"
      >
        <p className="text-sm">🛍️</p>
        <p className="text-sm flex-1 leading-22px">{t("common.orders")}</p>
        {isLoadingInitData ? (
          <Skeleton className="rounded-md w-8 h-14px" />
        ) : (
          <p className="text-xs text-sky-600">{ordersCount}</p>
        )}
        <RightIcon />
      </div>
      <div
        onClick={onClickPromoCode}
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px border-t border-t-sky-50 cursor-pointer"
      >
        <p className="text-sm">🏷️</p>
        <p className="text-sm flex-1 leading-22px">{t("common.coupons")}</p>
        {isLoadingInitData ? (
          <Skeleton className="rounded-md w-8 h-14px" />
        ) : (
          <p className="text-xs text-sky-600">{couponsCount}</p>
        )}
        <RightIcon />
      </div>
      <div className="px-4 pt-5 pb-3 text-xl leading-5 font-semibold">
        {t("common.settings")}
      </div>
      <DropdownBoxWithSearchMobile2
        label={`📍 ${t("auth.select_default_type")}`}
        list={typeList}
        activeItem={selectedType}
        onChange={onChangeType}
      />
      <div
        onClick={() => setIsOpenPwdModal(true)}
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px border-y border-y-sky-50 cursor-pointer"
      >
        <p className="text-sm">🔑</p>
        <p className="text-sm flex-1 leading-22px">{t("common.password")}</p>
        <RightIcon />
      </div>
      <div
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px"
      >
        <p className="text-sm">🔐</p>
        <p className="text-sm flex-1 leading-22px">{t("common.twoF")}</p>
        <Switch on={user.two_factor} onChange={onClick2FSwitch} />
      </div>
      <div
        onClick={onClickVPN}
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px border-y border-y-sky-50 cursor-pointer"
      >
        <p className="text-sm">🧑🏻‍💻</p>
        <p className="text-sm flex-1 leading-22px">
          {t("profile.personal_VPN")}
        </p>
        <RightIcon />
      </div>
      <div
        onClick={() => setIsOpenTerminateModal(true)}
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px cursor-pointer"
      >
        <p className="text-sm font-medium text-red-300 flex-1">
          {t("profile.terminate_sessions")}
        </p>
        <RightIcon fill="#FF6635" />
      </div>
    </>
  );
};

export default ProfileMobile;
