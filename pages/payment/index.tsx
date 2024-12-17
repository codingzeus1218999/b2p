"use client";

import { BalanceInput, ButtonBase, ButtonWhite } from "@/components/Forms";
import {
  AvailableIcon,
  BankIcon,
  DoubleCheckIcon,
  InfoCircleIcon,
  LeftIcon,
  MessagesIcon,
  WarningModalIcon,
} from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import {
  CopyIconButton,
  NavigatorBack,
  PaymentSystem,
  Spinner,
} from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import {
  chatTypeInterface,
  paymentInterface,
  paymentSystemInterface,
  tipPaymentInterface,
} from "@/interfaces";
import ImgPsCard from "@/public/images/ps-card.svg";
import ImgPsOther from "@/public/images/ps-other.svg";
import ImgPsQiwi from "@/public/images/ps-qiwi.svg";
import ImgPsSbp from "@/public/images/ps-sbp.svg";
import ImgPsSim from "@/public/images/ps-sim.svg";
import { getAccount } from "@/services/accountsApi";
import { fetchTipsPayment, getPayedRules } from "@/services/instructionsApi";
import { createChat, getChatTypes } from "@/services/messagesApi";
import {
  fetchPayment,
  fetchPaymentSystems,
  getPayments,
  paymentCancel,
  paymentExpired,
  paymentPayed,
  paymentTopup,
} from "@/services/paymentsApi";
import { convertSecondsToMMSS } from "@/utils/calcUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

let counterTopupWaiting: NodeJS.Timeout;
let counterGetPaymentState: NodeJS.Timeout;

const PaymentPage = () => {
  const t = useTranslations();
  const [isOpenRuleModal, setIsOpenRuleModal] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [rulesPayed, setRulesPayed] = useState<string>("");
  const [paymentSystems, setPaymentSystems] = useState<
    paymentSystemInterface[]
  >([]);
  const router = useRouter();
  const { user, setUser } = useUser();
  const { isLoggedIn } = useAuth();
  const [topupAmount, setTopupAmount] = useState<number>(0);
  const [payment, setPayment] = useState<paymentInterface | null>(null);
  const [existingPayment, setExistingPayment] =
    useState<paymentInterface | null>(null);
  const [topupRemainSeconds, setTopupRemainSeconds] = useState<number>(
    MAGIC_NUMBERS.TOPUP_WAITING_SECONDS
  );
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [pageState, setPageState] = useState<
    | "init"
    | "topupLoading"
    | "paymentWaiting"
    | "confirmWaiting"
    | "canceled"
    | "successed"
    | "expired"
    | "problem"
  >("init");
  const [lastPageState, setLastPageState] = useState<
    | "init"
    | "topupLoading"
    | "paymentWaiting"
    | "confirmWaiting"
    | "canceled"
    | "successed"
    | "expired"
    | "problem"
  >("init");
  const [msg, setMsg] = useState<string>("");
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const [isShowCancelModal, setIsShowCancelModal] = useState<boolean>(false);
  const [isShowExistingConfirmModal, setIsShowExistingConfirmModal] =
    useState<boolean>(false);
  const [selectedPaymentSystem, setSelectedPaymentSystem] =
    useState<paymentSystemInterface>();
  const [page, setPage] = useState<"" | "topup">("");
  const [requisites, setRequisites] = useState<string | null>(null);
  const [tipPayments, setTipPayments] = useState<tipPaymentInterface>([]);
  const { showToast } = useToast();
  const [chatTypes, setChatTypes] = useState<chatTypeInterface[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    calcWidth();
    getInitData();
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
      clearInterval(counterGetPaymentState);
      clearInterval(counterTopupWaiting);
    };
  }, []);

  const getInitData = async () => {
    try {
      const txtpr = await getPayedRules();
      const pss = await fetchPaymentSystems();
      const tp = await fetchTipsPayment();
      const cts = await getChatTypes();
      setPaymentSystems(pss);
      setRulesPayed(txtpr);
      setTipPayments(tp);
      setChatTypes(cts);
    } catch (err) {
      console.log("Error getting init data", err);
    }
  };

  const onClickCancelPayment = async () => {
    if (existingPayment) {
      const res = await paymentCancel(existingPayment?.id);
      const newp = await paymentTopup({
        amount: topupAmount,
        order_id: "",
        payment_system_id: selectedPaymentSystem?.id ?? "",
      });
      setPayment(newp);
      setPage("topup");
      setPageState("topupLoading");
    }
    setIsShowExistingConfirmModal(false);
  };

  const onClickContinuePayment = async () => {
    if (!existingPayment) return;
    setIsShowExistingConfirmModal(false);
    const pss = await fetchPaymentSystems();
    setSelectedPaymentSystem(
      pss.filter((t) => t.id === existingPayment?.payment_system_id)[0]
    );
    setPayment(existingPayment);
    setPage("topup");
    if (
      existingPayment.status === "open" &&
      existingPayment.requisites === null
    )
      setPageState("topupLoading");
    if (
      existingPayment.status === "open" &&
      existingPayment.requisites !== null
    )
      setPageState("paymentWaiting");
    if (existingPayment.status === "paid") setPageState("confirmWaiting");
  };

  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const onClickPaymentCancel = async () => {
    clearInterval(counterGetPaymentState);
    clearInterval(counterTopupWaiting);
    setCancelling(true);
    const res = await paymentCancel(payment?.id ?? "");
    setPayment(res);
    setPageState("canceled");
    setCancelling(false);
    setIsShowCancelModal(false);
  };

  const onClickSendMsg = async () => {
    if (msg === "") return;
    setSendingMsg(true);
    try {
      const res = await createChat({
        type_id:
          chatTypes.filter((ti) => ti.title === t("payment.problem"))?.[0].id ??
          "",
        message: msg,
      });
      router.push("/tickets");
      setSendingMsg(false);
    } catch (err: any) {
      console.log("Error creating chat", err);
      showToast(err?.response?.data?.errors?.throttling, "error");
      setSendingMsg(false);
    }
  };

  const onClickPaymentSystem = async (
    ps: paymentSystemInterface,
    amount: number
  ) => {
    try {
      setSelectedPaymentSystem(ps);
      // check non-confirmed payment
      const op = await getPayments("open");
      const pp = await getPayments("paid");
      if (op.length > 0) {
        setExistingPayment(op[0]);
        setIsShowExistingConfirmModal(true);
      } else if (pp.length > 0) {
        setExistingPayment(pp[0]);
        setIsShowExistingConfirmModal(true);
      } else {
        const res = await paymentTopup({
          amount,
          order_id: "",
          payment_system_id: ps.id,
        });
        setPayment(res);
        setPage("topup");
        setPageState("topupLoading");
      }
    } catch (err: any) {
      console.log("Error payment topup", err);
    }
  };

  const onClickPaymentPayed = async () => {
    if (!payment) return;
    try {
      const res = await paymentPayed(payment.id);
      setPayment(res);
      setPageState("confirmWaiting");
    } catch (err) {
      console.log("Error payment payed", err);
      const res = await paymentCancel(payment.id);
      setPayment(res);
      setPage("");
      setPageState("init");
    }
  };

  useEffect(() => {
    if (page === "topup") {
      counterTopupWaiting = setInterval(() => {
        setTopupRemainSeconds((prev) => prev - 1);
      }, 1000);
      counterGetPaymentState = setInterval(async () => {
        if (!payment) return;
        const res = await fetchPayment(payment.id);
        setPayment(res);
        setRequisites(res.requisites);
        if (res.status === "confirmed") {
          setPageState("successed");
          const resUser = await getAccount();
          setUser(resUser);
        }
      }, 2000);
    } else {
      setTopupRemainSeconds(MAGIC_NUMBERS.TOPUP_WAITING_SECONDS);
      clearInterval(counterTopupWaiting);
      clearInterval(counterGetPaymentState);
    }
  }, [page]);

  useEffect(() => {
    if (topupRemainSeconds < 2) {
      clearInterval(counterTopupWaiting);
      clearInterval(counterGetPaymentState);
      paymentExp();
    }
  }, [topupRemainSeconds]);

  const paymentExp = async () => {
    const res = await paymentExpired(payment?.id ?? "");
    setPayment(res);
    setPageState("expired");
  };

  useEffect(() => {
    if (requisites && pageState === "topupLoading") {
      setPageState("paymentWaiting");
    }
  }, [requisites]);

  return (
    <Layout>
      {isLoggedIn && (
        <>
          <Modal
            isOpen={isShowExistingConfirmModal}
            onRequestClose={onClickCancelPayment}
            style={{
              content: {
                width: screenWidth > 1023 ? "352px" : "calc(100% - 32px)",
                borderRadius: "8px",
                height: "min-content",
                maxHeight: "calc(100% - 32px)",
                background: "white",
                margin: "auto",
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
              <WarningModalIcon className="mx-auto" />
              <p className="font-semibold mt-10px">
                {t("payment.existing_title")}
              </p>
              <p>{t("payment.existing_description")}</p>
              <div className="mt-4">
                <ButtonBase
                  status="active"
                  onClick={onClickContinuePayment}
                  style="red"
                >
                  {t("payment.to_existing_payment")}
                </ButtonBase>
              </div>
              <div className="mt-3">
                <ButtonWhite status="active" onClick={onClickCancelPayment}>
                  {t("common.cancel")}
                </ButtonWhite>
              </div>
            </div>
          </Modal>
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
                padding: "24px 16px 0px 16px",
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
              <div>
                <WarningModalIcon className="mx-auto" />
                <p className="font-semibold uppercase mt-10px">
                  {t("payment.payed_rule_title")}
                </p>
                <div className="my-4 bg-zinc-100 h-px w-full"></div>
                <div dangerouslySetInnerHTML={{ __html: rulesPayed }} />
              </div>
              <div className="sticky bottom-0 bg-white pb-6">
                <div className="my-4 bg-zinc-100 h-px w-full"></div>
                <ButtonBase
                  status="active"
                  onClick={() => setIsOpenRuleModal(false)}
                >
                  {t("common.understand")}
                </ButtonBase>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={isShowCancelModal}
            onRequestClose={() => setIsShowCancelModal(false)}
            style={{
              content: {
                width: screenWidth > 1023 ? "352px" : "calc(100% - 32px)",
                borderRadius: "8px",
                height: "min-content",
                maxHeight: "calc(100% - 32px)",
                background: "white",
                margin: "auto",
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
              <WarningModalIcon className="mx-auto" />
              <p className="font-semibold mt-10px">{t("common.attention")}</p>
              <p>{t("payment.confirm_cancelling")}</p>
              <div className="mt-4">
                <ButtonBase
                  status={cancelling ? "disable" : "active"}
                  onClick={onClickPaymentCancel}
                  style="red"
                >
                  <div className="flex items-center justify-center am-gapX-12px">
                    {cancelling && (
                      <Spinner
                        color="white"
                        size={26}
                        width={3}
                        innerColor="#b1b1b1"
                      />
                    )}
                    <span>{t("common.do_cancel")}</span>
                  </div>
                </ButtonBase>
              </div>
              <div className="mt-3">
                <ButtonWhite
                  status="active"
                  onClick={() => setIsShowCancelModal(false)}
                >
                  {t("common.no_cancel")}
                </ButtonWhite>
              </div>
            </div>
          </Modal>
          <div className="lg:mt-30px lg:w-536px lg:mx-auto lg:max-w-536px">
            <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
              <LeftIcon
                className="absolute cursor-pointer left-4 top-5"
                onClick={() => router.back()}
              />
              {pageState === "problem"
                ? t("payment.problem")
                : t("payment.balance_topup")}
            </div>
            <div className="hidden lg:flex pr-4 items-center justify-between">
              <NavigatorBack />
              <p className="text-2xl font-semibold">
                {pageState === "problem"
                  ? t("payment.problem")
                  : t("payment.balance_topup")}
              </p>
            </div>
            <div className="px-4 lg:rounded-lg lg:pb-4 lg:pt-3 lg:shadow-custom-1">
              {pageState === "init" && (
                <>
                  <div className="hidden lg:flex py-3 flex-col justify-between h-56px border-b border-b-sky-50 mb-2">
                    <p className="text-zinc-200 text-xs leading-none">
                      {t("common.your_balance")}
                    </p>
                    <p className="leading-4 text-red-300">
                      {Number(user.balance).toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                  <BalanceInput
                    activeVal={topupAmount}
                    onChangeVal={setTopupAmount}
                  />
                  <p className="text-zinc-200 text-xs leading-none mt-2">
                    {t("payment.min_err")}
                  </p>
                  <div className="my-4">
                    <ButtonBase
                      onClick={() => {
                        setIsOpenRuleModal(true);
                      }}
                      status="active"
                      style="secondary"
                    >
                      <div className="flex items-center">
                        <span className="text-xs uppercase mr-3">
                          {t("payment.rules")}
                        </span>
                        <InfoCircleIcon />
                      </div>
                    </ButtonBase>
                  </div>
                  <p className="leading-5 font-semibold">
                    {t("payment.method")}
                  </p>
                  <p className="text-xs leading-none text-zinc-200 mt-1">
                    {t("common.instantly")}
                  </p>
                  <div className="mt-3 flex flex-col am-gapY-12px">
                    {paymentSystems.map((ps, _idx) => (
                      <PaymentSystem
                        key={_idx}
                        ps={ps}
                        lackPrice={topupAmount > 499 ? topupAmount : 0}
                        onClick={onClickPaymentSystem}
                      />
                    ))}
                  </div>
                </>
              )}
              {page === "topup" && (
                <>
                  <div className="hidden lg:flex py-3 flex-col justify-between h-56px border-b border-b-sky-50 mb-2">
                    <p className="text-zinc-200 text-xs leading-none">
                      {t("common.your_balance")}
                    </p>
                    <p className="leading-4 text-red-300">
                      {Number(user.balance).toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                  <div className="flex flex-col am-gapY-12px">
                    {selectedPaymentSystem && (
                      <div className="flex justify-between items-center">
                        <div className="mr-3">
                          <p className="leading-5 font-semibold">
                            {t("payment.method")}
                          </p>
                          <p className="mt-1 text-xs leading-3 text-sky-600">
                            {selectedPaymentSystem.title}
                          </p>
                        </div>
                        <Image
                          src={
                            selectedPaymentSystem.type === "card"
                              ? ImgPsCard
                              : selectedPaymentSystem.type === "other"
                              ? ImgPsOther
                              : selectedPaymentSystem.type === "qiwi"
                              ? ImgPsQiwi
                              : selectedPaymentSystem.type === "sbp"
                              ? ImgPsSbp
                              : ImgPsSim
                          }
                          alt={selectedPaymentSystem.code}
                          className="w-51px h-8"
                        />
                      </div>
                    )}
                    {pageState !== "topupLoading" && (
                      <div
                        className="py-3 flex justify-between items-center"
                        style={{
                          borderTop: "0.5px solid #EEF1F8",
                          borderBottom: "0.5px solid #EEF1F8",
                        }}
                      >
                        <div>
                          <p className="text-zinc-200 text-xs leading-3">
                            {t("payment.id")}
                          </p>
                          <p className="text-xs leading-4 mt-2">
                            {payment?.id ?? ""}
                          </p>
                        </div>
                        <CopyIconButton val={payment?.id ?? ""} />
                      </div>
                    )}
                    <ButtonBase
                      onClick={() => {
                        setIsOpenRuleModal(true);
                      }}
                      status="active"
                      style="secondary"
                    >
                      <div className="flex items-center">
                        <span className="text-xs uppercase mr-3">
                          {t("payment.rules")}
                        </span>
                        <InfoCircleIcon />
                      </div>
                    </ButtonBase>
                    <div
                      className={classNames(
                        "h-8 w-full rounded-xl border flex items-center justify-center",
                        {
                          "border-yellow-400 bg-yellow-100": [
                            "topupLoading",
                            "paymentWaiting",
                            "confirmWaiting",
                          ].includes(pageState),
                          "bg-zinc-100 border-neutral-400":
                            pageState === "canceled",
                          "bg-green-50 border-green-100":
                            pageState === "successed",
                          "border-red-300 bg-yellow-70":
                            pageState === "expired",
                        }
                      )}
                    >
                      {pageState === "topupLoading" && (
                        <>
                          <Spinner
                            size={20}
                            width={2}
                            color="blue"
                            innerColor="#FFF6E9"
                          />
                          <p className="px-2 text-xs">
                            {t("payment.waiting_details")}
                          </p>
                        </>
                      )}
                      {pageState === "paymentWaiting" && (
                        <p className="px-2 text-xs">
                          {t("payment.waiting_fund")}
                        </p>
                      )}
                      {pageState === "confirmWaiting" && (
                        <p className="px-2 text-xs">
                          {t("payment.waiting_fund")}
                        </p>
                      )}
                      {pageState === "canceled" && (
                        <p className="px-2 text-xs">{t("payment.cancel")}</p>
                      )}
                      {pageState === "successed" && (
                        <>
                          <AvailableIcon />
                          <p className="px-2 text-xs ml-6px">
                            {t("payment.replenishment_done")}
                          </p>
                        </>
                      )}
                      {pageState === "expired" && (
                        <p className="px-2 text-xs">{t("payment.expired")}</p>
                      )}
                    </div>
                    {pageState === "paymentWaiting" && (
                      <p className="text-xs leading-5 text-red-300 font-bold text-center">
                        {t("payment.will_cancel")}{" "}
                        {convertSecondsToMMSS(topupRemainSeconds)}
                      </p>
                    )}
                    {pageState === "confirmWaiting" && (
                      <p className="text-xs leading-5 font-bold text-center">
                        {t("payment.will_receive")}
                      </p>
                    )}
                    {pageState === "expired" && (
                      <p className="text-xs leading-5 text-red-300 font-bold text-center">
                        {t("payment.expired_description")}
                      </p>
                    )}
                    {pageState === "topupLoading" && (
                      <div className="relative">
                        <Swiper
                          spaceBetween={8}
                          slidesPerView={1}
                          modules={[Autoplay, Pagination]}
                          autoplay={{ delay: 3000 }}
                          pagination={{
                            clickable: true,
                            el: ".swiper-pagination-custom",
                          }}
                          className="relative"
                        >
                          {tipPayments.map((s, _idx) => (
                            <SwiperSlide key={_idx}>
                              <div className="p-3 lg:p-4 rounded-xl border border-blue-50 text-indigo-300 text-sm text-center">
                                {s}
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        <div className="swiper-pagination-custom swiper-pagination-style-2 mt-3"></div>
                      </div>
                    )}
                    {pageState !== "canceled" &&
                      pageState !== "expired" &&
                      pageState !== "successed" && (
                        <ButtonBase
                          status="active"
                          style="red"
                          onClick={() => setIsShowCancelModal(true)}
                        >
                          {t("payment.do_cancel")}
                        </ButtonBase>
                      )}
                  </div>
                  {pageState !== "topupLoading" && (
                    <div className="mt-5 flex flex-col am-gapY-20px">
                      <div>
                        {selectedPaymentSystem?.code === "sbp" ? (
                          <>
                            <div
                              className="py-3 flex justify-between items-center h-56px"
                              style={{
                                borderTop: "0.5px solid #EEF1F8",
                                borderBottom: "0.5px solid #EEF1F8",
                              }}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <p className="text-zinc-200 text-xs leading-none">
                                  {t("payment.number")}
                                </p>
                                <p className="leading-4">+7 999 975-96-65</p>
                              </div>
                              <CopyIconButton val="+7 999 975-96-65" />
                            </div>
                            <div
                              className="py-3 flex justify-between items-center h-56px"
                              style={{
                                borderBottom: "0.5px solid #EEF1F8",
                              }}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <p className="text-zinc-200 text-xs leading-none">
                                  {t("payment.exactly_amount")}, ₽
                                </p>
                                <p className="leading-4">
                                  {Number(
                                    Math.floor(
                                      (topupAmount *
                                        selectedPaymentSystem.percent) /
                                        100
                                    ) + topupAmount
                                  ).toLocaleString("ru-RU")}
                                </p>
                              </div>
                              <CopyIconButton
                                val={Number(
                                  Math.floor(
                                    (topupAmount *
                                      selectedPaymentSystem.percent) /
                                      100
                                  ) + topupAmount
                                ).toString()}
                              />
                            </div>
                            <div
                              className="py-3 flex justify-between items-center h-56px"
                              style={{
                                borderBottom: "0.5px solid #EEF1F8",
                              }}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <p className="text-zinc-200 text-xs leading-none">
                                  {t("payment.bank_receive")}
                                </p>
                                <div className="leading-4 flex items-center">
                                  <BankIcon />
                                  <span className="ml-2">
                                    {t("payment.raifajen")}
                                  </span>
                                </div>
                              </div>
                              <CopyIconButton val={t("payment.raifajen")} />
                            </div>
                            <div
                              className="py-3 flex justify-between items-center h-56px"
                              style={{
                                borderBottom: "0.5px solid #EEF1F8",
                              }}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <p className="text-zinc-200 text-xs leading-none">
                                  {t("common.receiver")}
                                </p>
                                <p className="leading-4">
                                  {t("common.sergei")}
                                </p>
                              </div>
                              <CopyIconButton val={t("common.sergei")} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="py-3 flex justify-between items-center h-56px"
                              style={{
                                borderTop: "0.5px solid #EEF1F8",
                                borderBottom: "0.5px solid #EEF1F8",
                              }}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <p className="text-zinc-200 text-xs leading-none">
                                  {t("payment.number_map")}
                                </p>
                                <p className="leading-4">{requisites ?? ""}</p>
                              </div>
                              <CopyIconButton
                                val={(requisites ?? "").toString()}
                              />
                            </div>
                            <div
                              className="py-3 flex justify-between items-center h-56px"
                              style={{
                                borderBottom: "0.5px solid #EEF1F8",
                              }}
                            >
                              <div className="flex flex-col justify-between h-full">
                                <p className="text-zinc-200 text-xs leading-none">
                                  {t("payment.exactly_amount")}, ₽
                                </p>
                                <p className="leading-4">
                                  {Number(
                                    Math.floor(
                                      (topupAmount *
                                        (selectedPaymentSystem?.percent ?? 1)) /
                                        100
                                    ) + topupAmount
                                  ).toLocaleString("ru-RU")}
                                </p>
                              </div>
                              <CopyIconButton
                                val={
                                  Number(
                                    Math.floor(
                                      (topupAmount *
                                        (selectedPaymentSystem?.percent ?? 1)) /
                                        100
                                    ) + topupAmount
                                  ).toString() ?? ""
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {(pageState === "paymentWaiting" ||
                        pageState === "confirmWaiting") && (
                        <div>
                          <ButtonBase
                            onClick={onClickPaymentPayed}
                            status={
                              pageState === "confirmWaiting"
                                ? "disable"
                                : "active"
                            }
                          >
                            {pageState === "confirmWaiting" ? (
                              <div className="flex justify-center items-center">
                                <Spinner
                                  size={26}
                                  color="white"
                                  innerColor="#b1b1b1"
                                />
                                <p className="ml-4">
                                  {t("payment.confirming")}
                                </p>
                              </div>
                            ) : (
                              <div className="flex justify-center items-center">
                                <DoubleCheckIcon />
                                <span className="ml-3">
                                  {t("payment.paid")}
                                </span>
                              </div>
                            )}
                          </ButtonBase>
                          <p className="text-sm leading-4 text-zinc-200 -mt-1 mb-1 text-center">
                            {t("payment.paid_click_msg")}
                          </p>
                        </div>
                      )}
                      {(pageState === "paymentWaiting" ||
                        pageState === "expired" ||
                        pageState === "confirmWaiting") && (
                        <ButtonBase
                          status="active"
                          onClick={() => {
                            setPage("");
                            setLastPageState(pageState);
                            setPageState("problem");
                          }}
                          style="secondary"
                        >
                          <div className="flex items-center justify-center">
                            <MessagesIcon />
                            <span className="text-neutral-200 ml-3">
                              {t("payment.problem")}
                            </span>
                          </div>
                        </ButtonBase>
                      )}
                    </div>
                  )}
                </>
              )}
              {pageState === "problem" && (
                <div className="pt-4 pb-5 lg:pt-1">
                  <p className="leading-none font-semibold mb-3">
                    {t("ticket.describe_situation")}
                  </p>
                  <div>
                    <input
                      type="text"
                      className="px-4 py-13px rounded-lg w-full bg-gray-100 text-sm focus:text-sky-600 border border-gray-100 focus:border-sky-600 focus:bg-white"
                      placeholder={t("order.input_feedback_text")}
                      value={msg}
                      onChange={(e) => setMsg(e.target.value.slice(0, 256))}
                    />
                    <p className="text-xs text-zinc-200 leading-none mt-3">
                      {t("ticket.max_string")}
                    </p>
                  </div>
                  <div className="flex flex-col am-gapY-12px mt-4">
                    <ButtonBase
                      status={msg && !sendingMsg ? "active" : "disable"}
                      onClick={onClickSendMsg}
                    >
                      {sendingMsg ? (
                        <Spinner size={26} color="white" innerColor="#b1b1b1" />
                      ) : (
                        t("common.send")
                      )}
                    </ButtonBase>
                    <ButtonWhite
                      onClick={() => {
                        setPage("topup");
                        setPageState(lastPageState);
                      }}
                      status="active"
                    >
                      {t("common.cancel")}
                    </ButtonWhite>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default PaymentPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
