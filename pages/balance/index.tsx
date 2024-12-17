"use client";

import {
  ButtonBase,
  ButtonWhite,
  DropdownBox,
  DropdownBoxDateRangePicker,
  Paginator,
} from "@/components/Forms";
import {
  AvailableIcon,
  BankIcon,
  InfoCircleIcon,
  LeftIcon,
  MessagesIcon,
  WarningModalIcon,
} from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import {
  CopyIconButton,
  NavigatorBack,
  PaymentHistoryItem,
  Spinner,
} from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import {
  chatTypeInterface,
  dropdownItemInterface,
  paymentHistoryInterface,
  paymentInterface,
  paymentSystemInterface,
} from "@/interfaces";
import ImgPsCard from "@/public/images/ps-card.svg";
import ImgPsOther from "@/public/images/ps-other.svg";
import ImgPsQiwi from "@/public/images/ps-qiwi.svg";
import ImgPsSbp from "@/public/images/ps-sbp.svg";
import ImgPsSim from "@/public/images/ps-sim.svg";
import { getPayedRules } from "@/services/instructionsApi";
import { createChat, getChatTypes } from "@/services/messagesApi";
import {
  fetchPayment,
  fetchPaymentHistory,
  fetchPaymentSystems,
} from "@/services/paymentsApi";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";

const BalancePage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();
  const [selectedOperation, setSelectedOperation] =
    useState<dropdownItemInterface>({
      label: t("payment.all_operations"),
      value: "all",
    });
  const [startD, setStartD] = useState(undefined);
  const [endD, setEndD] = useState(undefined);
  const [payments, setPayments] = useState<paymentHistoryInterface[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [operations, setOperations] = useState();
  const [selectedPayment, setSelectedPayment] = useState<paymentInterface>();
  const [selectedPaymentSystem, setSelectedPaymentSystem] =
    useState<paymentSystemInterface>();
  const [page, setPage] = useState<"list" | "payment" | "problem">("list");
  const { isLoggedIn } = useAuth();
  const [isOpenRuleModal, setIsOpenRuleModal] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [rulesPayed, setRulesPayed] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const [chatTypes, setChatTypes] = useState<chatTypeInterface[]>([]);
  const { showToast } = useToast();

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
    };
  }, []);

  const getInitData = async () => {
    try {
      const txtpr = await getPayedRules();
      setRulesPayed(txtpr);
      const cts = await getChatTypes();
      setChatTypes(cts);
    } catch (err) {
      console.log("Error getting init data", err);
    }
  };
  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
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
  const onChangeOperation = (val: dropdownItemInterface) => {
    setSelectedOperation(val);
    if (startD && endD)
      getHistory(
        val.value,
        new Date(startD).getTime(),
        new Date(endD).getTime(),
        MAGIC_NUMBERS.PAYMENTS_PER_PAGE,
        pageNumber
      );
    setPageNumber(1);
  };
  const onClickHistoryItemCard = async (val: paymentHistoryInterface) => {
    if (val.payment_id === null) return;
    const res = await fetchPayment(val.payment_id);
    setSelectedPayment(res);
    const pss = await fetchPaymentSystems();
    setSelectedPaymentSystem(
      pss.filter((t) => t.id === res?.payment_system_id)[0]
    );
    setPage("payment");
  };

  const onChangeRange = (start: any, end: any) => {
    setStartD(start);
    setEndD(end);
    if (start && end)
      getHistory(
        selectedOperation.value,
        new Date(start).getTime(),
        new Date(end).getTime(),
        MAGIC_NUMBERS.PAYMENTS_PER_PAGE,
        pageNumber
      );
    setPageNumber(1);
  };
  const getHistory = async (
    ope: string,
    s: number,
    e: number,
    l: number,
    p: number
  ) => {
    try {
      const res = await fetchPaymentHistory(ope, s, e, l, p);
      setPageCount(res.meta.total);
      setPayments(res.data);
      setOperations(res.operations);
    } catch (err) {
      console.log("Error getting payment history", err);
    }
  };
  const onClickPaginator = async (val: number) => {
    setPageNumber(val);
    if (startD && endD)
      getHistory(
        selectedOperation.value,
        new Date(startD).getTime(),
        new Date(endD).getTime(),
        MAGIC_NUMBERS.PAYMENTS_PER_PAGE,
        val
      );
  };
  return (
    <Layout>
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
      {isLoggedIn && (
        <div className="lg:mt-30px lg:w-536px lg:mx-auto lg:max-w-536px">
          {page === "list" && (
            <>
              <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
                <LeftIcon
                  className="absolute cursor-pointer left-4 top-5"
                  onClick={() => router.back()}
                />
                {t("payment.history")}
              </div>
              <div className="hidden lg:block p-4 text-2xl font-semibold">
                {t("payment.balance")}
              </div>
              <div className="lg:hidden px-4">
                <DropdownBox
                  label={t("payment.type_operation")}
                  list={[
                    { label: t("payment.all_operations"), value: "all" },
                    { label: t("payment.refund"), value: "withdrawal" },
                    { label: t("payment.replenishment"), value: "deposit" },
                    { label: t("payment.payment"), value: "payment" },
                  ]}
                  activeItem={selectedOperation}
                  onChange={onChangeOperation}
                />
                <div className="mt-2">
                  <DropdownBoxDateRangePicker
                    label={t("common.period")}
                    startD={startD}
                    endD={endD}
                    onChangeRange={onChangeRange}
                  />
                </div>
                {payments.length === 0 && (
                  <p className="mt-3 leading-5 font-medium text-neutral-400 text-center">
                    {t("common.no_data")}
                  </p>
                )}
                {payments.length > 0 && (
                  <div className="mt-1 flex flex-col am-gapY-4px">
                    {payments.map((p, _idx) => (
                      <PaymentHistoryItem
                        key={_idx}
                        payment={p}
                        operations={operations}
                        onClick={onClickHistoryItemCard}
                      />
                    ))}
                  </div>
                )}
                {pageCount > 1 && (
                  <div className="mt-6 mb-4">
                    <Paginator
                      pageNumber={pageNumber}
                      pageCount={pageCount}
                      onClickPage={onClickPaginator}
                    />
                  </div>
                )}
              </div>
              <div className="hidden lg:block w-full shadow-custom-1 rounded-lg pt-18px px-4 pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs leading-none text-zinc-200">
                      {t("common.your_balance")}
                    </p>
                    <p className="leading-4 text-red-300 mt-2">
                      {Number(user.balance).toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                  <div className="w-111px min-w-111px">
                    <ButtonBase
                      status="active"
                      onClick={() => {
                        router.push("/payment");
                      }}
                    >
                      {t("common.topup")}
                    </ButtonBase>
                  </div>
                </div>
                <div className="h-px w-full bg-sky-50 mt-6px"></div>
                <p className="mt-2px font-semibold leading-44px">
                  {t("payment.history")}
                </p>
                <div className="mt-2px grid grid-cols-2 gap-3">
                  <DropdownBox
                    label={t("payment.type_operation")}
                    list={[
                      { label: t("payment.all_operations"), value: "all" },
                      { label: t("payment.refund"), value: "withdrawal" },
                      { label: t("payment.replenishment"), value: "deposit" },
                      { label: t("payment.payment"), value: "payment" },
                    ]}
                    activeItem={selectedOperation}
                    onChange={onChangeOperation}
                  />
                  <DropdownBoxDateRangePicker
                    label={t("common.period")}
                    startD={startD}
                    endD={endD}
                    onChangeRange={onChangeRange}
                  />
                </div>
                {payments.length === 0 && (
                  <p className="mt-3 leading-5 font-medium text-neutral-400 text-center">
                    {t("common.no_data")}
                  </p>
                )}
                {payments.length > 0 && (
                  <div className="mt-2 flex flex-col am-gapY-4px">
                    {payments.map((p, _idx) => (
                      <PaymentHistoryItem
                        key={_idx}
                        payment={p}
                        operations={operations}
                        onClick={onClickHistoryItemCard}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden lg:block">
                {pageCount > 1 && (
                  <div className="mt-8 mb-4">
                    <Paginator
                      pageNumber={pageNumber}
                      pageCount={pageCount}
                      onClickPage={onClickPaginator}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {page === "payment" && (
            <>
              <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
                <LeftIcon
                  className="absolute cursor-pointer left-4 top-5"
                  onClick={() => setPage("list")}
                />
                {t("payment.balance_topup")}
              </div>
              <div className="hidden lg:flex pr-4 items-center justify-between">
                <NavigatorBack onClick={() => setPage("list")} onOnePage />
                <p className="text-2xl font-semibold">
                  {t("payment.balance_topup")}
                </p>
              </div>
              <div className="px-4 lg:pt-3 lg:pb-4 lg:rounded-lg lg:shadow-custom-1">
                <div className="hidden lg:flex py-3 flex-col justify-between h-56px border-b border-b-sky-50 mb-2">
                  <p className="text-zinc-200 text-xs leading-none">
                    {t("common.your_balance")}
                  </p>
                  <p className="leading-4 text-sky-600">
                    {Number(user.balance).toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="mr-3">
                    <p className="leading-5 font-semibold">
                      {t("payment.method")}
                    </p>
                    <p className="mt-1 text-xs leading-3 text-sky-600">
                      {selectedPaymentSystem?.title}
                    </p>
                  </div>
                  <Image
                    src={
                      selectedPaymentSystem?.type === "card"
                        ? ImgPsCard
                        : selectedPaymentSystem?.type === "other"
                        ? ImgPsOther
                        : selectedPaymentSystem?.type === "qiwi"
                        ? ImgPsQiwi
                        : selectedPaymentSystem?.type === "sbp"
                        ? ImgPsSbp
                        : ImgPsSim
                    }
                    alt={selectedPaymentSystem?.code ?? ""}
                    className="w-51px h-8"
                  />
                </div>
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
                <div
                  className={classNames(
                    "h-8 w-full rounded-xl border flex items-center justify-center",
                    {
                      "bg-zinc-100 border-neutral-400":
                        selectedPayment?.status === "cancel",
                      "bg-green-50 border-green-100":
                        selectedPayment?.status === "confirmed",
                      "border-red-300 bg-yellow-70":
                        selectedPayment?.status === "expired",
                    }
                  )}
                >
                  {selectedPayment?.status === "cancel" && (
                    <p className="px-2 text-xs">{t("payment.cancel")}</p>
                  )}
                  {selectedPayment?.status === "confirmed" && (
                    <>
                      <AvailableIcon />
                      <p className="px-2 text-xs ml-6px">
                        {t("payment.replenishment_done")}
                      </p>
                    </>
                  )}
                  {selectedPayment?.status === "expired" && (
                    <p className="px-2 text-xs">{t("payment.expired")}</p>
                  )}
                </div>
                {selectedPayment?.status === "expired" && (
                  <>
                    <p className="my-3 text-red-300 text-xs leading-5 font-bold text-center">
                      {t("payment.expired_description")}
                    </p>
                    <ButtonBase
                      status="active"
                      onClick={() => {}}
                      style="secondary"
                    >
                      <div className="flex items-center justify-center">
                        <MessagesIcon />
                        <span className="text-neutral-200 ml-3">
                          {t("payment.problem")}
                        </span>
                      </div>
                    </ButtonBase>
                  </>
                )}
                <div className="mt-3">
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
                              selectedPayment?.amount ?? 0
                            ).toLocaleString("ru-RU")}
                          </p>
                        </div>
                        <CopyIconButton
                          val={Number(selectedPayment?.amount ?? 0).toString()}
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
                          <p className="leading-4">{t("common.sergei")}</p>
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
                            {selectedPayment?.requisites ?? ""}
                          </p>
                        </div>
                        <CopyIconButton
                          val={(selectedPayment?.requisites ?? "").toString()}
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
                              selectedPayment?.amount ?? 0
                            ).toLocaleString("ru-RU")}
                          </p>
                        </div>
                        <CopyIconButton
                          val={
                            Number(selectedPayment?.amount ?? 0).toString() ??
                            ""
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          {page === "problem" && (
            <>
              <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
                <LeftIcon
                  className="absolute cursor-pointer left-4 top-5"
                  onClick={() => setPage("payment")}
                />
                {t("payment.problem")}
              </div>
              <div className="hidden lg:flex pr-4 items-center justify-between">
                <NavigatorBack onClick={() => setPage("payment")} onOnePage />
                <p className="text-2xl font-semibold">{t("payment.problem")}</p>
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
                  >
                    {sendingMsg ? (
                      <Spinner size={26} color="white" innerColor="#b1b1b1" />
                    ) : (
                      t("common.send")
                    )}
                  </ButtonBase>
                  <ButtonWhite
                    onClick={() => {
                      setPage("payment");
                    }}
                    status="active"
                  >
                    {t("common.cancel")}
                  </ButtonWhite>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default BalancePage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
