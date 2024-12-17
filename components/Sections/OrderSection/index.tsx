"use client";

import { ButtonBase, ButtonWhite, RatingSelector } from "@/components/Forms";
import {
  InfoCircleIcon,
  LeftIcon,
  MessagesIcon,
  WarningModalIcon,
} from "@/components/Icons";
import {
  CopyIconButton,
  NavigatorBack,
  ProductSimpleCard,
  Spinner,
} from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useToast } from "@/context/ToastContext";
import {
  OrderSectionProps,
  chatTypeInterface,
  orderFeedbackQueryInterface,
  orderInterface,
  productStocksInterface,
} from "@/interfaces";
import { checkStock } from "@/services/catalogsApi";
import { createChat, getChatTypes } from "@/services/messagesApi";
import { orderDone, orderFeedback } from "@/services/ordersApi";
import { convertSecondsToHHMMSS } from "@/utils/calcUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";

let counterOrderWaiting: NodeJS.Timeout;

const OrderSection: React.FC<OrderSectionProps> = ({
  isLoading = false,
  order,
}) => {
  const t = useTranslations();
  const [displayOrder, setDisplayOrder] = useState<orderInterface>();
  const [isLoadingInitData, setIsLoadingInitData] = useState<boolean>(true);
  const [stockInfo, setStockInfo] = useState<productStocksInterface>();
  const [page, setPage] = useState<"" | "feedback" | "problem">("");
  const [orderRemainSeconds, setOrderRemainSeconds] = useState<number>(
    MAGIC_NUMBERS.ORDER_WAITING_SECONDS
  );
  const [feedbackPayload, setFeedbackPayload] =
    useState<orderFeedbackQueryInterface>({
      feedback: "",
      marketplace: 0,
      order_id: "",
      product: 0,
      shipment: 0,
    });
  const [isOpenFeedbackConfirmModal, setIsOpenFeedbackConfirmModal] =
    useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const router = useRouter();
  const [pageState, setPageState] = useState<"" | "sendingFeedback">("");
  const { showToast } = useToast();
  const [msg, setMsg] = useState<string>("");
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const [chatTypes, setChatTypes] = useState<chatTypeInterface[]>([]);

  useEffect(() => {
    calcScreenWidth();
    getInitData();
    window.addEventListener("resize", calcScreenWidth);
    return () => {
      window.removeEventListener("resize", calcScreenWidth);
      clearInterval(counterOrderWaiting);
    };
  }, []);

  useEffect(() => {
    const getStock = async (oid: string) => {
      setIsLoadingInitData(true);
      try {
        const res = await checkStock(oid);
        setStockInfo(res);
      } catch (err) {
        console.log("Error getting stock info", err);
      } finally {
        setIsLoadingInitData(false);
      }
    };
    if (order) {
      setDisplayOrder(order);
      getStock(order.stock_id);
      setFeedbackPayload({ ...feedbackPayload, order_id: order.id });
      if (order.status === "progress") {
        counterOrderWaiting = setInterval(() => {
          setOrderRemainSeconds((prev) => prev - 1);
        }, 1000);
      } else {
        setOrderRemainSeconds(MAGIC_NUMBERS.ORDER_WAITING_SECONDS);
        clearInterval(counterOrderWaiting);
      }
    }
  }, [order]);

  const getInitData = async (): Promise<void> => {
    try {
      const cts = await getChatTypes();
      setChatTypes(cts);
    } catch (err) {
      console.log("Error fetching the initial data");
    }
  };

  const calcScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    if (orderRemainSeconds < 2) {
      clearInterval(counterOrderWaiting);
      doneOrder();
      router.back();
    }
  }, [orderRemainSeconds]);

  const doneOrder = async () => {
    if (!displayOrder) return;
    await orderDone(displayOrder.id);
  };
  const onClickLeaveFeedback = async () => {
    if (!order) return;
    setPageState("sendingFeedback");
    try {
      const res = await orderDone(order.id);
      setDisplayOrder(res);
      await orderFeedback(feedbackPayload);
      setPage("");
      showToast(t("order.leave_review"), "success");
    } catch (err: any) {
      console.log("Error sending feedback", err);
    } finally {
      setIsOpenFeedbackConfirmModal(false);
      setPageState("");
    }
  };

  const onClickSendMsg = async () => {
    if (msg === "") return;
    try {
      const res = await createChat({
        type_id:
          chatTypes.filter((ti) => ti.title === t("order.problem"))?.[0].id ??
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
  return (
    <>
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
      {displayOrder && page !== "problem" && (
        <>
          <div className="hidden lg:flex items-center justify-between pr-4 lg:mt-8">
            <NavigatorBack />
            <p className="font-semibold text-2xl lg:tracking-custom">
              {t("order.information")}
            </p>
          </div>
          <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
            <LeftIcon
              className="absolute cursor-pointer left-4 top-5"
              onClick={() => {
                router.back();
              }}
            />
            {t("order.information")}
          </div>
          <div className="pt-0 pb-10 px-4 lg:py-4 lg:rounded-lg lg:shadow-custom-1">
            {page === "" ? (
              <div className="flex flex-col am-gapY-10px am-lg-gapY-12px">
                <ProductSimpleCard
                  isLoading={isLoading || isLoadingInitData}
                  product={displayOrder.product}
                  isShowLabels={false}
                  price={displayOrder.order_price}
                  desktopBuyerColor
                  mobileBuyerColor
                />
                {stockInfo && (
                  <>
                    <div className="bg-gray-50 rounded-xl py-1.5 px-4 flex items-center am-gapX-4px justify-center text-sm flex-wrap">
                      <div className="bg-blue-50 py-1 px-2 rounded-lg flex items-center am-gapX-4px relative cursor-pointer group">
                        <p className="text-sky-600 text-10px leading-4">
                          {stockInfo.delivered_at.split(" ")[1]}
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
                      <div>{stockInfo.size.split("-")[0]}</div>
                      <div>/</div>
                      {stockInfo.delivery.split(" / ").map((d, _idx) => (
                        <>
                          <div>{d}</div>
                          <div>/</div>
                        </>
                      ))}
                      <div>
                        {displayOrder?.product?.quantity ?? 0}{" "}
                        {displayOrder?.product?.unit ?? "шт"}.
                      </div>
                    </div>
                    <div>
                      <p className="leading-8 font-semibold">
                        {t("payment.purchase_details")}
                      </p>
                      <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs leading-5">{t("order.order")}</p>
                        <div className="flex items-center text-10px lg:text-xs">
                          <p className="mr-1">{displayOrder.id}</p>
                          <CopyIconButton size={16} val={displayOrder.id} />
                        </div>
                      </div>
                      <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs leading-5">{t("common.site")}</p>
                        <p
                          className="text-xs leading-5"
                          dangerouslySetInnerHTML={{
                            __html: displayOrder.product.store.title,
                          }}
                        />
                      </div>
                      <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs leading-5">{t("buyer.buyer")}</p>
                        <p className="text-xs leading-5">
                          {displayOrder.product.shop.title}
                        </p>
                      </div>
                      <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs leading-5">
                          1 {displayOrder.product.unit}.
                        </p>
                        <p className="text-xs leading-5">
                          {t("payment.upfront")}
                        </p>
                      </div>
                      <div className="my-2 lg:my-3 h-px w-full bg-sky-50"></div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs leading-5">{t("common.price")}</p>
                        <p className="text-xs leading-5">
                          {Number(displayOrder.stock_price).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          ₽
                        </p>
                      </div>
                      <div className="mt-2 lg:mt-3 h-px w-full bg-sky-50"></div>
                    </div>
                  </>
                )}
                {displayOrder.status === "progress" && (
                  <div className="flex flex-col am-gapY-12px">
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
                      onClick={() => setPage("problem")}
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
                          __html: displayOrder?.description ?? "",
                        }}
                      />
                    </div>
                  </div>
                )}
                {displayOrder.status === "refund" && (
                  <div>
                    <ButtonBase
                      onClick={() => {
                        router.push("/tickets");
                      }}
                      status="active"
                      style="red"
                    >
                      {t("order.go_ticket")}
                    </ButtonBase>
                    <div className="mt-3">
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
                )}
                {displayOrder.status === "done" && displayOrder.feedback && (
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
                      value={displayOrder.feedback?.feedback ?? ""}
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
                        value={displayOrder.feedback?.marketplace ?? 0}
                        size={18}
                        gap={4}
                      />
                    </div>
                    <div className="my-3 lg:my-4 h-px w-full bg-sky-50"></div>
                    <div className="flex justify-between">
                      <p className="text-xs leading-5">{t("buyer.job")}</p>
                      <RatingSelector
                        readOnly={true}
                        value={displayOrder.feedback?.shipment ?? 0}
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
                        value={displayOrder.feedback?.product ?? 0}
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
                          __html: displayOrder?.description ?? "",
                        }}
                      />
                    </div>
                  </div>
                )}
                {displayOrder.status === "done" &&
                  displayOrder.feedback === null &&
                  displayOrder.description && (
                    <div className="flex flex-col am-gapY-12px">
                      <ButtonBase
                        onClick={() => setPage("feedback")}
                        status="active"
                      >
                        {t("common.leave_feedback")}
                      </ButtonBase>
                      <div>
                        <p className="leading-8 lg:text-2xl font-semibold">
                          {t("order.receive")}
                        </p>
                        <div
                          className="text-sm mt-2"
                          dangerouslySetInnerHTML={{
                            __html: displayOrder?.description ?? "",
                          }}
                        />
                      </div>
                    </div>
                  )}
                {displayOrder.status === "done" &&
                  displayOrder.feedback === null &&
                  !displayOrder.description && (
                    <div className="flex flex-col am-gapY-12px">
                      <ButtonBase
                        onClick={() => setPage("feedback")}
                        status="active"
                      >
                        {t("common.leave_feedback")}
                      </ButtonBase>
                      <div>
                        <p className="leading-8 lg:text-2xl font-semibold">
                          {t("order.receive")}
                        </p>
                        <div className="text-sm mt-2">
                          {t("order.info_comming")}
                        </div>
                      </div>
                      <ButtonBase
                        style="secondary"
                        onClick={() => router.push("/tickets")}
                        status="active"
                      >
                        <div className="flex items-center">
                          <MessagesIcon />
                          <span className="ml-3 text-neutral-200">
                            {t("ticket.to_support")}
                          </span>
                        </div>
                      </ButtonBase>
                    </div>
                  )}
              </div>
            ) : (
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
                  {t("order.quality_product")}
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
                    status={feedbackPayload.feedback ? "active" : "disable"}
                    onClick={() => setIsOpenFeedbackConfirmModal(true)}
                  >
                    {t("order.leave_feedback")}
                  </ButtonBase>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {page === "problem" && (
        <div className="lg:w-536px lg:mx-auto lg:max-w-536px lg:mt-8">
          <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
            <LeftIcon
              className="absolute cursor-pointer left-4 top-5"
              onClick={() => {
                setPage("");
                setPageState("");
              }}
            />
            {t("order.problem")}
          </div>
          <div className="hidden lg:flex pr-4 items-center justify-between">
            <NavigatorBack
              onClickEvent={() => {
                setPage("");
                setPageState("");
              }}
            />
            <p className="text-2xl font-semibold">{t("order.problem")}</p>
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
                style="red"
              >
                {sendingMsg ? (
                  <Spinner size={26} color="white" innerColor="#b1b1b1" />
                ) : (
                  t("common.report")
                )}
              </ButtonBase>
              <ButtonWhite
                onClick={() => {
                  setPageState("");
                  setPage("");
                }}
                status="active"
              >
                {t("common.cancel")}
              </ButtonWhite>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSection;
