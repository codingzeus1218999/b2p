"use client";

import { ButtonBase, ButtonWhite, RatingSelector } from "@/components/Forms";
import {
  BankIcon,
  DoubleCheckIcon,
  InfoCircleIcon,
  LeftIcon,
  MessagesIcon,
  WarningModalIcon,
} from "@/components/Icons";
import {
  CopyIconButton,
  CouponCard,
  NavigatorBack,
  PaymentSystem,
  ProductSimpleCard,
  ProgressBar,
  Spinner,
} from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import { StockContext } from "@/context/StockContext";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import {
  BuyFlowSectionProps,
  chatTypeInterface,
  couponInterface,
  orderFeedbackQueryInterface,
  orderInterface,
  paymentInterface,
  paymentSystemInterface,
  productInterface,
  tipPayedInterface,
  tipPaymentInterface,
} from "@/interfaces";
import ImgPsCard from "@/public/images/ps-card.svg";
import ImgPsOther from "@/public/images/ps-other.svg";
import ImgPsQiwi from "@/public/images/ps-qiwi.svg";
import ImgPsSbp from "@/public/images/ps-sbp.svg";
import ImgPsSim from "@/public/images/ps-sim.svg";
import { getAccount } from "@/services/accountsApi";
import { fetchProductById, getCoupon } from "@/services/catalogsApi";
import {
  fetchTipsPayed,
  fetchTipsPayment,
  getPayedRules,
} from "@/services/instructionsApi";
import { createChat, getChatTypes } from "@/services/messagesApi";
import {
  getOrders,
  madeNewOrder,
  orderCancel,
  orderDone,
  orderFeedback,
  orderPayed,
} from "@/services/ordersApi";
import {
  fetchPayment,
  fetchPaymentSystems,
  getPayments,
  paymentCancel,
  paymentExpired,
  paymentPayed,
  paymentTopup,
} from "@/services/paymentsApi";
import {
  convertSecondsToHHMMSS,
  convertSecondsToMMSS,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

let counterTopupWaiting: NodeJS.Timeout;
let counterPayProgressBar: NodeJS.Timeout;
let counterOrderWaiting: NodeJS.Timeout;
let counterGetPaymentState: NodeJS.Timeout;

const BuyFlowSection: React.FC<BuyFlowSectionProps> = ({
  productId,
  couponId,
}) => {
  const t = useTranslations();
  const pageTitle = {
    init: { desktop: t("order.you_buy"), mobile: t("order.you_buy") },
    payment: {
      desktop: t("order.shopping"),
      mobile: t("order.shopping"),
    },
    topup: {
      desktop: t("order.shopping"),
      mobile: t("payment.balance_topup"),
    },
    ready: {
      desktop: t("order.shopping"),
      mobile: t("order.shopping"),
    },
    paid: { desktop: t("order.information"), mobile: t("order.information") },
    feedback: { desktop: t("order.review"), mobile: t("order.review") },
    end: { desktop: t("order.information"), mobile: t("order.information") },
    problem: { desktop: "", mobile: "" },
  };
  const [product, setProduct] = useState<productInterface>();
  const [coupon, setCoupon] = useState<couponInterface>();
  const [order, setOrder] = useState<orderInterface>();
  const [payment, setPayment] = useState<paymentInterface>();
  const [existingPayment, setExistingPayment] = useState<paymentInterface>();
  const [paymentSystems, setPaymentSystems] = useState<
    paymentSystemInterface[]
  >([]);
  const [rulesPayed, setRulesPayed] = useState<string>("");
  const [tipPayments, setTipPayments] = useState<tipPaymentInterface>([]);
  const [tipPayed, setTipPayed] = useState<tipPayedInterface>([]);
  const [page, setPage] = useState<
    | "init"
    | "payment"
    | "topup"
    | "ready"
    | "paid"
    | "feedback"
    | "end"
    | "problem"
  >("init");
  const [pageState, setPageState] = useState<
    | ""
    | "initLoading"
    | "paymentSystemLoading"
    | "paymentTopupLoading"
    | "paymentPayWaiting"
    | "paymentConfirmWaiting"
    | "paymentCancelLoading"
    | "paymentCanceled"
    | "paymentExpired"
    | "orderPayedLoading"
    | "sendingFeedback"
  >("initLoading");
  const [problemType, setProblemType] = useState<"payment" | "order">(
    "payment"
  );
  const [chatTypes, setChatTypes] = useState<chatTypeInterface[]>([]);
  const [lastPage, setLastPage] = useState<
    | "init"
    | "payment"
    | "topup"
    | "ready"
    | "paid"
    | "feedback"
    | "end"
    | "problem"
  >("init");
  const [lastPageState, setLastPageState] = useState<
    | ""
    | "initLoading"
    | "paymentSystemLoading"
    | "paymentTopupLoading"
    | "paymentPayWaiting"
    | "paymentConfirmWaiting"
    | "paymentCancelLoading"
    | "paymentCanceled"
    | "paymentExpired"
    | "orderPayedLoading"
    | "sendingFeedback"
  >("initLoading");
  const [isOpenRuleModal, setIsOpenRuleModal] = useState<boolean>(false);
  const [isOpenFeedbackConfirmModal, setIsOpenFeedbackConfirmModal] =
    useState<boolean>(false);
  const [
    isOpenExistingPaymentConfirmModal,
    setIsOpenExistingPaymentConfirmModal,
  ] = useState<boolean>(false);
  const [selectedPaymentSystem, setSelectedPaymentSystem] =
    useState<paymentSystemInterface>();
  const [msg, setMsg] = useState<string>("");
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [topupRemainSeconds, setTopupRemainSeconds] = useState<number>(
    MAGIC_NUMBERS.TOPUP_WAITING_SECONDS
  );
  const [orderRemainSeconds, setOrderRemainSeconds] = useState<number>(
    MAGIC_NUMBERS.ORDER_WAITING_SECONDS
  );
  const [orderPayProgressBarWidth, setOrderPayProgressBarWidth] =
    useState<number>(0);
  const [feedbackPayload, setFeedbackPayload] =
    useState<orderFeedbackQueryInterface>({
      feedback: "",
      marketplace: 0,
      order_id: "",
      product: 0,
      shipment: 0,
    });
  const [requisites, setRequisites] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(0);
  const { showToast } = useToast();
  const router = useRouter();
  const { stock } = useContext(StockContext);
  const { user, setUser } = useUser();
  const { isLoggedIn } = useAuth();
  const [showCancelPaymentModal, setShowCancelPaymentModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?tab=login"); // if user is not logged in, redirect to login page
      return;
    }
    calcScreenWidth();
    window.addEventListener("resize", calcScreenWidth);
    getInitData();
    return () => {
      window.removeEventListener("resize", calcScreenWidth);
      clearInterval(counterTopupWaiting);
      clearInterval(counterPayProgressBar);
      clearInterval(counterOrderWaiting);
      clearInterval(counterGetPaymentState);
    };
  }, []);

  const calcScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const getInitData = async (): Promise<void> => {
    if (!stock || !user) router.push("/");
    setPageState("initLoading");
    try {
      const txtpr = await getPayedRules();
      setRulesPayed(txtpr);
      const tp = await fetchTipsPayment();
      const tpy = await fetchTipsPayed();
      if (couponId) {
        const co = await getCoupon(couponId);
        setCoupon(co);
      }
      // check pending orders
      const odc = await getOrders("create", 100, 1);
      odc.data.forEach(async (o) => await orderCancel(o.id));
      const od = await madeNewOrder(stock.id);
      const p = await fetchProductById(productId);
      const cts = await getChatTypes();
      setChatTypes(cts);
      // const stl = await getProductStocks(id);
      // if (!stl.map((v) => v.id).includes(stock.id)) router.push("/");
      if (p) {
        setProduct(p);
        setTopupAmount(od.order_price - user.balance);
      } else router.push("/");
      setOrder(od);
      setTipPayments(tp);
      setTipPayed(tpy);
      setFeedbackPayload({ ...feedbackPayload, order_id: od.id });
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setPageState("");
    }
  };

  const onClickSendMsg = async () => {
    if (msg === "") return;
    setSendingMsg(true);
    try {
      const res = await createChat({
        type_id:
          chatTypes.filter((ti) =>
            problemType === "order"
              ? ti.title === t("order.problem")
              : ti.title === t("payment.problem")
          )?.[0].id ?? "",
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

  const onClickContinuePayment = async () => {
    if (!existingPayment) return;
    setIsOpenExistingPaymentConfirmModal(false);
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
      setPageState("paymentTopupLoading");
    if (
      existingPayment.status === "open" &&
      existingPayment.requisites !== null
    )
      setPageState("paymentPayWaiting");
    if (existingPayment.status === "paid")
      setPageState("paymentConfirmWaiting");
  };

  const onClickCancelPayment = async () => {
    if (existingPayment) {
      const res = await paymentCancel(existingPayment?.id);
      const newp = await paymentTopup({
        amount: topupAmount,
        order_id: order?.id ?? "",
        payment_system_id: selectedPaymentSystem?.id ?? "",
      });
      setPayment(newp);
      setPage("topup");
      setPageState("paymentTopupLoading");
    }
    setIsOpenExistingPaymentConfirmModal(false);
  };

  const onClickCheck = async () => {
    if (!user || !product) return;
    if (user.balance < (order?.order_price ?? 0)) {
      setPageState("paymentSystemLoading");
      try {
        const pss = await fetchPaymentSystems();
        setPaymentSystems(pss);
        setPage("payment");
      } catch (err) {
        console.log("Error fetching the payment systems");
      } finally {
        setPageState("");
      }
    } else {
      setPage("ready");
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
        setIsOpenExistingPaymentConfirmModal(true);
      } else if (pp.length > 0) {
        setExistingPayment(pp[0]);
        setIsOpenExistingPaymentConfirmModal(true);
      } else {
        const res = await paymentTopup({
          amount,
          order_id: order?.id ?? "",
          payment_system_id: ps.id,
        });
        setPayment(res);
        setPage("topup");
        setPageState("paymentTopupLoading");
      }
    } catch (err: any) {
      console.log("Error payment topup", err);
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
          setPage("ready");
          setPageState("");
          const resUser = await getAccount();
          setUser(resUser);
        }
      }, 2000);
    } else {
      setTopupRemainSeconds(MAGIC_NUMBERS.TOPUP_WAITING_SECONDS);
      clearInterval(counterTopupWaiting);
      clearInterval(counterGetPaymentState);
    }
    if (page === "paid") {
      counterOrderWaiting = setInterval(() => {
        setOrderRemainSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      setOrderRemainSeconds(MAGIC_NUMBERS.ORDER_WAITING_SECONDS);
      clearInterval(counterOrderWaiting);
    }
  }, [page]);

  useEffect(() => {
    if (pageState === "orderPayedLoading") {
      counterPayProgressBar = setInterval(() => {
        setOrderPayProgressBarWidth((prev) => prev + 0.07);
      }, 200);
    } else {
      setOrderPayProgressBarWidth(0);
      clearInterval(counterPayProgressBar);
    }
  }, [pageState]);

  useEffect(() => {
    if (topupRemainSeconds < 2) {
      clearInterval(counterTopupWaiting);
      clearInterval(counterGetPaymentState);
      paymentExp();
    }
  }, [topupRemainSeconds]);

  const onClickPaymentCancel = async () => {
    clearInterval(counterGetPaymentState);
    clearInterval(counterTopupWaiting);
    setPageState("paymentCancelLoading");
    const res = await paymentCancel(payment?.id ?? "");
    setPayment(res);
    setPageState("paymentCanceled");
    setShowCancelPaymentModal(false);
  };

  const paymentExp = async () => {
    const res = await paymentExpired(payment?.id ?? "");
    setPayment(res);
    setPageState("paymentExpired");
  };

  useEffect(() => {
    if (requisites && pageState === "paymentTopupLoading") {
      setPageState("paymentPayWaiting");
    }
  }, [requisites]);

  const onClickPaymentPayed = async () => {
    if (!payment) return;
    try {
      const res = await paymentPayed(payment.id);
      setPayment(res);
      setPageState("paymentConfirmWaiting");
    } catch (err) {
      console.log("Error payment payed", err);
      const res = await paymentCancel(payment.id);
      setPayment(res);
      setPage("payment");
      setPageState("");
    }
  };

  const onClickOrderPayed = async () => {
    if (!order) return;
    setPageState("orderPayedLoading");
    try {
      const res = await orderPayed(order.id);
      setPage("paid");
      setPageState("");
      setOrder(res);
      const resUser = await getAccount();
      setUser(resUser);
    } catch (err) {
      console.log("Error order payed", err);
      setPage("init");
      setPageState("");
    }
  };

  useEffect(() => {
    if (orderRemainSeconds < 2) {
      clearInterval(counterOrderWaiting);
      doneOrder();
      router.back();
    }
  }, [orderRemainSeconds]);

  const doneOrder = async () => {
    if (!order) return;
    await orderDone(order.id);
  };

  const onClickLeaveFeedback = async () => {
    if (!order) return;
    setPageState("sendingFeedback");
    try {
      await orderDone(order.id);
      const res = await orderFeedback(feedbackPayload);
      if (res) {
        setPage("end");
        showToast(t("order.leave_review"), "success");
      }
    } catch (err: any) {
      console.log("Error sending feedback", err);
    } finally {
      setIsOpenFeedbackConfirmModal(false);
      setPageState("");
    }
  };

  return isLoggedIn ? (
    <>
      <Modal
        isOpen={isOpenExistingPaymentConfirmModal}
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
          <p className="font-semibold mt-10px">{t("payment.existing_title")}</p>
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
        isOpen={showCancelPaymentModal}
        onRequestClose={() => setShowCancelPaymentModal(false)}
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
              status="active"
              onClick={onClickPaymentCancel}
              style="red"
            >
              {t("common.cancel")}
            </ButtonBase>
          </div>
          <div className="mt-3">
            <ButtonWhite
              status="active"
              onClick={() => setShowCancelPaymentModal(false)}
            >
              {t("common.no_cancel")}
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
        isOpen={isOpenFeedbackConfirmModal}
        onRequestClose={() => setIsOpenFeedbackConfirmModal(false)}
        style={{
          content: {
            width: screenWidth > 1023 ? "352px" : "calc(100% - 32px)",
            borderRadius: "8px",
            height: "min-content",
            background: "white",
            margin: screenWidth > 1023 ? "auto" : "auto 16px",
            padding: "24px 16px 16px 16px",
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
          <p className="font-semibold mt-10px">{t("order.done_title")}</p>
          <p>{t("order.done_description")}</p>
          <div className="mt-4">
            <ButtonBase
              onClick={onClickLeaveFeedback}
              status={pageState === "sendingFeedback" ? "disable" : "active"}
            >
              {pageState === "sendingFeedback" ? (
                <Spinner color="white" size={26} innerColor="#b1b1b1" />
              ) : (
                <span>{t("common.decided")}</span>
              )}
            </ButtonBase>
          </div>
          <div className="mt-3"></div>
          <ButtonWhite
            status="active"
            onClick={() => setIsOpenFeedbackConfirmModal(false)}
          >
            {t("common.cancel")}
          </ButtonWhite>
        </div>
      </Modal>
      <div className="mt-0 lg:mt-8 pb-10 lg:pb-0">
        {page !== "problem" && (
          <div className="flex flex-col lg:flex-row">
            {(page === "init" ||
              page === "payment" ||
              page === "topup" ||
              page === "ready") && (
              <div className="hidden lg:block lg:w-336px lg:min-w-336px px-4 py-6 rounded-lg shadow-custom-1 h-fit lg:mr-8">
                <p className="uppercase font-semibold text-center">
                  {t("payment.payed_rule_title")}
                </p>
                <div
                  className="mt-10px"
                  dangerouslySetInnerHTML={{ __html: rulesPayed }}
                />
              </div>
            )}
            <div
              className={`flex-1 ${
                ["init", "payment", "topup", "ready"].includes(page)
                  ? "lg:max-w-calc1"
                  : "lg:max-w-full"
              }`}
            >
              <div className="hidden lg:flex items-center justify-between">
                <NavigatorBack
                  onClickEvent={() => {
                    saveDataInLocalStorage(LOCALSTORAGES.LAST_SEARCH_STATE, {
                      pid: productId,
                      initload: false,
                    });
                  }}
                />
                <p className="font-semibold text-2xl mr-4 lg:tracking-custom">
                  {pageTitle[page].desktop}
                </p>
              </div>
              <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
                <LeftIcon
                  className="absolute cursor-pointer left-4 top-5"
                  onClick={() => {
                    saveDataInLocalStorage(LOCALSTORAGES.LAST_SEARCH_STATE, {
                      pid: productId,
                      initload: false,
                    });
                    router.back();
                  }}
                />
                {pageTitle[page].mobile}
              </div>
              {page !== "feedback" &&
                page !== "paid" &&
                page !== "end" &&
                couponId && (
                  <div className="mb-3 lg:mb-4 px-4 lg:px-0">
                    <CouponCard
                      isLoading={pageState === "initLoading"}
                      data={coupon}
                    />
                  </div>
                )}
              <div className="px-4 lg:py-4 lg:shadow-custom-1 flex flex-col am-gapY-12px lg:rounded-lg">
                {page !== "feedback" && (
                  <>
                    <ProductSimpleCard
                      isLoading={pageState === "initLoading"}
                      product={product}
                      isShowLabels={false}
                      price={stock.price}
                      desktopBuyerColor
                      mobileBuyerColor
                    />
                    <div className="bg-gray-50 rounded-xl py-1.5 px-4 flex items-center am-gapX-4px justify-center text-sm flex-wrap">
                      <div className="bg-blue-50 py-1 px-2 rounded-lg flex items-center am-gapX-4px relative cursor-pointer group">
                        <p className="text-sky-600 text-10px leading-4">
                          {stock.delivered_at.split(" ")[1]}
                        </p>
                        <InfoCircleIcon />
                        <div
                          className="px-3 py-2 bg-white rounded-lg text-neutral-400 text-sm absolute z-10 w-fit whitespace-nowrap shadow-custom-1 hidden group-hover:block text-center lg:-left-20 -left-7"
                          style={{ top: "calc(100% + 4px)" }}
                        >
                          {t("product.information")}
                          <br />
                          {t("product.about_information")}
                        </div>
                      </div>
                      <div>/</div>
                      <div>{stock.size.split("-")[0]}</div>
                      <div>/</div>
                      {stock.delivery
                        .split(" / ")
                        .map((d: string, _idx: number) => (
                          <div className="flex items-center" key={_idx}>
                            <div>{d}</div>
                            <div>/</div>
                          </div>
                        ))}
                      <div>
                        {product?.quantity ?? 0} {product?.unit ?? "шт"}.
                      </div>
                    </div>
                  </>
                )}
                {page === "init" && pageState !== "initLoading" && (
                  <>
                    <div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderTop: "0.5px solid #EEF1F8",
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("order.countdown")}
                        </p>
                        <p className="leading-4 line-through">
                          {Number(order?.store_price ?? 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </p>
                      </div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-sky-600 text-xs leading-none font-semibold">
                          {t("common.your_price")}
                        </p>
                        <p className="leading-4 text-sky-600 font-semibold">
                          {Number(order?.stock_exchange ?? 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </p>
                      </div>
                    </div>
                    <ButtonBase
                      onClick={onClickCheck}
                      status={
                        pageState === "paymentSystemLoading"
                          ? "disable"
                          : "active"
                      }
                    >
                      {pageState === "paymentSystemLoading" ? (
                        <Spinner color="white" size={26} innerColor="#b1b1b1" />
                      ) : (
                        <span>
                          {t("common.buy_with")}{" "}
                          {Number(order?.stock_exchange ?? 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </span>
                      )}
                    </ButtonBase>
                  </>
                )}
                {page === "payment" && (
                  <>
                    <div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderTop: "0.5px solid #EEF1F8",
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("payment.price_product")}
                        </p>
                        <p className="leading-4">
                          {Number(order?.order_price ?? 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </p>
                      </div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("common.your_balance")}
                        </p>
                        <p className="leading-4 text-red-300">
                          {Number(user?.balance ?? 0).toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("payment.not_enough")}
                        </p>
                        <p className="leading-4 text-red-300">
                          {Number(
                            (order?.order_price ?? 0) - (user?.balance ?? 0)
                          ).toLocaleString("ru-RU")}{" "}
                          ₽
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="leading-5 font-semibold">
                        {t("payment.topup")}
                      </p>
                      <p className="mt-1 text-zinc-200 text-xs leading-3">
                        {t("common.instantly")}
                      </p>
                    </div>
                    <div className="lg:hidden">
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
                    {paymentSystems.map((ps, _idx) => (
                      <PaymentSystem
                        key={_idx}
                        ps={ps}
                        lackPrice={topupAmount}
                        onClick={onClickPaymentSystem}
                      />
                    ))}
                  </>
                )}
                {page === "topup" && (
                  <>
                    <div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderTop: "0.5px solid #EEF1F8",
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("payment.price_product")}
                        </p>
                        <p className="leading-4">
                          {Number(order?.order_price ?? 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </p>
                      </div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("common.your_balance")}
                        </p>
                        <p className="leading-4 text-red-300">
                          {Number(user?.balance ?? 0).toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("payment.not_enough")}
                        </p>
                        <p className="leading-4 text-red-300">
                          {Number(
                            (order?.order_price ?? 0) - (user?.balance ?? 0)
                          ).toLocaleString("ru-RU")}{" "}
                          ₽
                        </p>
                      </div>
                    </div>
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
                    {pageState !== "paymentTopupLoading" && (
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
                    {pageState !== "paymentCanceled" &&
                      pageState !== "paymentExpired" && (
                        <div className="h-8 w-full rounded-xl border border-yellow-400 bg-yellow-100 flex items-center justify-center">
                          {pageState === "paymentTopupLoading" && (
                            <Spinner
                              size={20}
                              width={2}
                              color="blue"
                              innerColor="#FFF6E9"
                            />
                          )}
                          <p className="px-2 text-xs">
                            {pageState === "paymentTopupLoading"
                              ? t("payment.waiting_details")
                              : t("payment.waiting_fund")}
                          </p>
                        </div>
                      )}
                    {pageState === "paymentCanceled" && (
                      <div className="h-8 w-full rounded-xl border bg-zinc-100 border-neutral-400 flex items-center justify-center">
                        <p className="px-2 text-xs">{t("payment.cancel")}</p>
                      </div>
                    )}
                    {pageState === "paymentExpired" && (
                      <div className="h-8 w-full rounded-xl border border-red-300 bg-yellow-70 flex items-center justify-center">
                        <p className="px-2 text-xs">{t("payment.expired")}</p>
                      </div>
                    )}
                    {pageState === "paymentPayWaiting" && (
                      <p className="text-xs leading-5 text-red-300 font-bold text-center">
                        {t("payment.will_cancel")}{" "}
                        {convertSecondsToMMSS(topupRemainSeconds)}
                      </p>
                    )}
                    {pageState === "paymentConfirmWaiting" && (
                      <p className="text-xs leading-5 font-bold text-center">
                        {t("payment.will_recceive")}
                      </p>
                    )}
                    {pageState === "paymentTopupLoading" && (
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
                    {pageState !== "paymentExpired" &&
                      pageState !== "paymentCanceled" && (
                        <ButtonBase
                          status={
                            pageState === "paymentCancelLoading"
                              ? "disable"
                              : "active"
                          }
                          style="red"
                          onClick={() => setShowCancelPaymentModal(true)}
                        >
                          {pageState === "paymentCancelLoading" ? (
                            <Spinner
                              size={26}
                              color="white"
                              innerColor="#b1b1b1"
                            />
                          ) : (
                            <span>{t("payment.do_cancel")}</span>
                          )}
                        </ButtonBase>
                      )}
                    {pageState !== "paymentTopupLoading" && (
                      <>
                        <div className="py-2 lg:py-0">
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
                                  <p className="leading-4">
                                    {requisites ?? ""}
                                  </p>
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
                                          (selectedPaymentSystem?.percent ??
                                            1)) /
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
                                          (selectedPaymentSystem?.percent ??
                                            1)) /
                                          100
                                      ) + topupAmount
                                    ).toString() ?? ""
                                  }
                                />
                              </div>
                            </>
                          )}
                        </div>
                        {pageState !== "paymentCanceled" &&
                          pageState !== "paymentExpired" && (
                            <>
                              <ButtonBase
                                onClick={onClickPaymentPayed}
                                status={
                                  pageState === "paymentConfirmWaiting"
                                    ? "disable"
                                    : "active"
                                }
                              >
                                {pageState === "paymentConfirmWaiting" ? (
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
                            </>
                          )}
                        {pageState !== "paymentCanceled" && (
                          <ButtonBase
                            status="active"
                            onClick={() => {
                              setProblemType("payment");
                              setLastPage(page);
                              setLastPageState(pageState);
                              setPage("problem");
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
                      </>
                    )}
                  </>
                )}
                {page === "ready" && (
                  <>
                    <div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderTop: "0.5px solid #EEF1F8",
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("payment.price_product")}
                        </p>
                        <p className="leading-4">
                          {Number(order?.order_price ?? 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </p>
                      </div>
                      <div
                        className="py-3 flex flex-col justify-between"
                        style={{
                          borderBottom: "0.5px solid #EEF1F8",
                          height: "56px",
                        }}
                      >
                        <p className="text-zinc-200 text-xs leading-none">
                          {t("common.your_balance")}
                        </p>
                        <p className="leading-4 text-sky-600">
                          {Number(user?.balance ?? 0).toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    </div>
                    <ButtonBase
                      onClick={onClickOrderPayed}
                      status={
                        pageState === "orderPayedLoading" ? "disable" : "active"
                      }
                    >
                      {pageState === "orderPayedLoading" ? (
                        <div className="flex items-center">
                          <Spinner
                            size={26}
                            color="white"
                            innerColor="#b1b1b1"
                          />
                          <span className="ml-4">
                            {t("payment.cancel_click")}
                          </span>{" "}
                        </div>
                      ) : (
                        <span>{t("payment.please_pay")}</span>
                      )}
                    </ButtonBase>
                    {pageState === "orderPayedLoading" && (
                      <div className="-mt-1 flex flex-col am-gapY-8px">
                        <ProgressBar width={orderPayProgressBarWidth} />
                        <p className="text-sm leading-5 text-sky-600 font-medium text-center">
                          {t("common.wait_for_download")}
                        </p>
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
                            {tipPayed.map((s, _idx) => (
                              <SwiperSlide key={_idx}>
                                <div className="p-3 lg:p-4 rounded-xl border border-blue-50 text-indigo-300 text-sm text-center">
                                  {s}
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div className="swiper-pagination-custom swiper-pagination-style-2 mt-3"></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {page === "paid" && (
                  <>
                    {order && (
                      <div>
                        <p className="leading-8 font-semibold">
                          {t("payment.purchase_details")}
                        </p>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("order.order")}
                          </p>
                          <div className="flex items-center text-10px lg:text-xs">
                            <p className="mr-1">{order.id}</p>
                            <CopyIconButton size={16} val={order.id} />
                          </div>
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("common.site")}
                          </p>
                          <p
                            className="text-xs leading-5"
                            dangerouslySetInnerHTML={{
                              __html: order.product.store.title,
                            }}
                          />
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("buyer.buyer")}
                          </p>
                          <p className="text-xs leading-5">
                            {order.product.shop.title}
                          </p>
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            1 {order.product.unit}.
                          </p>
                          <p className="text-xs leading-5">
                            {t("payment.upfront")}
                          </p>
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("common.price")}
                          </p>
                          <p className="text-xs leading-5">
                            {Number(order.stock_price).toLocaleString("ru-RU")}{" "}
                            ₽
                          </p>
                        </div>
                        <div className="mt-2 lg:mt-3 h-px w-full bg-sky-50"></div>
                      </div>
                    )}
                    <ButtonBase
                      onClick={() => setPage("feedback")}
                      status="active"
                    >
                      {t("common.leave_feedback")}
                    </ButtonBase>
                    <div className="h-8 w-full rounded-xl border border-yellow-400 bg-yellow-100 flex items-center justify-center">
                      <span className="text-xs">
                        {t("order.waiting_closure")}{" "}
                        {convertSecondsToHHMMSS(orderRemainSeconds)}
                      </span>
                    </div>
                    <ButtonBase
                      onClick={() => {
                        setProblemType("order");
                        setLastPage(page);
                        setLastPageState(pageState);
                        setPage("problem");
                      }}
                      status="active"
                      style="red"
                    >
                      {t("order.problem")}
                    </ButtonBase>
                    <div>
                      <p className="leading-8 lg:text-2xl font-semibold">
                        {t("order.receive")}
                      </p>
                      <div
                        className="text-sm mt-2"
                        dangerouslySetInnerHTML={{
                          __html: order?.description ?? "",
                        }}
                      />
                    </div>
                  </>
                )}
                {page === "feedback" && (
                  <div>
                    <p className="leading-8 font-semibold mb-4 hidden lg:block">
                      {t("order.impressions")}
                    </p>
                    <p className="text-sm lg:text-base mb-2">
                      {t("order.feedback_text")}
                    </p>
                    <input
                      type="text"
                      className="p-4 rounded-lg w-full bg-gray-100 text-sm focus:text-sky-600 border border-gray-100 focus:border-sky-600 focus:bg-white"
                      placeholder={t("order.input_feedback_text")}
                      value={feedbackPayload.feedback}
                      onChange={(e) =>
                        setFeedbackPayload({
                          ...feedbackPayload,
                          feedback: e.target.value,
                        })
                      }
                    />
                    <p className="hidden lg:block mt-4 font-semibold leading-8">
                      {t("order.quality_service")}
                    </p>
                    <p className="mt-3 lg:mt-4 text-sm lg:text-base">
                      {t("order.quality_b2p")}
                    </p>
                    <div className="mt-2">
                      <RatingSelector
                        value={feedbackPayload.marketplace}
                        onChange={(val: number) =>
                          setFeedbackPayload({
                            ...feedbackPayload,
                            marketplace: val,
                          })
                        }
                      />
                    </div>
                    <div className="my-3 lg:my-4 h-px w-full bg-sky-50"></div>
                    <p className="mt-3 lg:mt-4 text-sm lg:text-base">
                      {t("buyer.job")}
                    </p>
                    <div className="mt-2">
                      <RatingSelector
                        value={feedbackPayload.shipment}
                        onChange={(val: number) =>
                          setFeedbackPayload({
                            ...feedbackPayload,
                            shipment: val,
                          })
                        }
                      />
                    </div>
                    <div className="my-3 lg:my-4 h-px w-full bg-sky-50"></div>
                    <p className="mt-3 lg:mt-4 text-sm lg:text-base">
                      {t("order.quaility_product")}
                    </p>
                    <div className="mt-2">
                      <RatingSelector
                        value={feedbackPayload.product}
                        onChange={(val: number) =>
                          setFeedbackPayload({
                            ...feedbackPayload,
                            product: val,
                          })
                        }
                      />
                    </div>
                    <div className="mt-3 lg:mt-4 h-px w-full bg-sky-50"></div>
                    <div className="mt-3">
                      <ButtonBase
                        status="active"
                        onClick={() => setIsOpenFeedbackConfirmModal(true)}
                      >
                        {t("order.leave_feedback")}
                      </ButtonBase>
                    </div>
                  </div>
                )}
                {page === "end" && (
                  <>
                    {order && (
                      <div>
                        <p className="leading-8 font-semibold">
                          {t("payment.purchase_details")}
                        </p>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("order.order")}
                          </p>
                          <div className="flex items-center text-10px lg:text-xs">
                            <p className="mr-1">{order.id}</p>
                            <CopyIconButton size={16} val={order.id} />
                          </div>
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("common.site")}
                          </p>
                          <p
                            className="text-xs leading-5"
                            dangerouslySetInnerHTML={{
                              __html: order.product.store.title,
                            }}
                          />
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("buyer.buyer")}
                          </p>
                          <p className="text-xs leading-5">
                            {order.product.shop.title}
                          </p>
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            1 {order.product.unit}.
                          </p>
                          <p className="text-xs leading-5">
                            {t("payment.upfront")}
                          </p>
                        </div>
                        <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs leading-5">
                            {t("common.price")}
                          </p>
                          <p className="text-xs leading-5">
                            {Number(order.stock_price).toLocaleString("ru-RU")}{" "}
                            ₽
                          </p>
                        </div>
                        <div className="mt-2 lg:mt-3 h-px w-full bg-sky-50"></div>
                      </div>
                    )}
                    <div>
                      <p className="leading-5 lg:leading-8 font-semibold mb-3 lg:mb-4">
                        {t("order.impressions")}
                      </p>
                      <p className="hidden lg:block mb-2">
                        {t("order.feedback_text")}
                      </p>
                      <input
                        type="text"
                        className="px-4 py-3 lg:py-4 text-sm lg:leading-22px rounded-xl w-full bg-gray-100 border border-gray-100"
                        value={feedbackPayload?.feedback ?? ""}
                        readOnly
                      />
                      <p className="mt-3 lg:mt-4 font-semibold leading-5 lg:leading-8">
                        {t("order.quality_service")}
                      </p>
                      <div className="my-3 lg:my-4 h-px w-full bg-sky-50"></div>
                      <div className="flex justify-between">
                        <p className="text-xs leading-5">
                          {t("order.quality_b2p")}
                        </p>
                        <RatingSelector
                          readOnly={true}
                          value={feedbackPayload?.marketplace ?? 0}
                          size={18}
                          gap={4}
                        />
                      </div>
                      <div className="my-3 lg:my-4 h-px w-full bg-sky-50"></div>
                      <div className="flex justify-between">
                        <p className="text-xs leading-5">{t("buyer.job")}</p>
                        <RatingSelector
                          readOnly={true}
                          value={feedbackPayload?.shipment ?? 0}
                          size={18}
                          gap={4}
                        />
                      </div>
                      <div className="my-3 lg:my-4 h-px w-full bg-sky-50"></div>
                      <div className="flex justify-between">
                        <p className="text-xs leading-5">
                          {t("order.quality_product")}
                        </p>
                        <RatingSelector
                          readOnly={true}
                          value={feedbackPayload?.product ?? 0}
                          size={18}
                          gap={4}
                        />
                      </div>
                      <div className="mt-3 lg:mt-4 mb-10px lg:mb-3 h-px w-full bg-sky-50"></div>
                      <div>
                        <p className="leading-8 lg:text-2xl font-semibold">
                          {t("order.receive")}
                        </p>
                        <div
                          className="text-sm mt-2"
                          dangerouslySetInnerHTML={{
                            __html: order?.description ?? "",
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {page === "problem" && (
          <div className="lg:w-536px lg:mx-auto lg:max-w-536px">
            <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
              <LeftIcon
                className="absolute cursor-pointer left-4 top-5"
                onClick={() => {
                  setPage(lastPage);
                  setPageState(lastPageState);
                }}
              />
              {problemType === "payment"
                ? t("payment.problem")
                : t("order.problem")}
            </div>
            <div className="hidden lg:flex pr-4 items-center justify-between">
              <NavigatorBack
                onClickEvent={() => {
                  setPage(lastPage);
                  setPageState(lastPageState);
                }}
              />
              <p className="text-2xl font-semibold">
                {problemType === "payment"
                  ? t("payment.problem")
                  : t("order.problem")}
              </p>
            </div>
            <div className="px-4 lg:pt-3 lg:pb-4 lg:rounded-lg lg:shadow-custom-1">
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
                  style={problemType === "order" ? "red" : "primary"}
                >
                  {sendingMsg ? (
                    <Spinner size={26} color="white" innerColor="#b1b1b1" />
                  ) : problemType === "payment" ? (
                    t("common.send")
                  ) : (
                    t("common.report")
                  )}
                </ButtonBase>
                <ButtonWhite
                  onClick={() => {
                    setPageState(lastPageState);
                    setPage(lastPage);
                  }}
                  status="active"
                >
                  {t("common.cancel")}
                </ButtonWhite>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <></>
  );
};

export default BuyFlowSection;
