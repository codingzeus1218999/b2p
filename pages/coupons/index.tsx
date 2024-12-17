"use client";

import { ButtonBase, Paginator } from "@/components/Forms";
import { InfoCircleIcon, LeftIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { CouponCard } from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import { couponInterface } from "@/interfaces";
import { getCoupons } from "@/services/catalogsApi";
import { getCouponText } from "@/services/instructionsApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";

const CouponsPage = () => {
  const t = useTranslations();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [textCouponTitle, setTextCouponTitle] = useState<string>("");
  const [textCouponContent, setTextCouponContent] = useState<string[]>([]);
  const [isOpenTextModal, setIsOpenTextModal] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [coupons, setCoupons] = useState<couponInterface[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/");
    getInitData();
  }, []);

  const getInitData = async () => {
    setIsLoading(true);
    try {
      const res = await getCouponText();
      setTextCouponContent(res.content);
      setTextCouponTitle(res.title);
      const cs = await getCoupons(MAGIC_NUMBERS.COUPONS_PER_PAGE, 1);
      setCoupons(cs.data);
      setPageCount(cs.meta.total);
    } catch (err) {
      console.log("Error getting init data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickPage = async (val: number) => {
    setPageNumber(val);
    const cs = await getCoupons(MAGIC_NUMBERS.COUPONS_PER_PAGE, val);
    setCoupons(cs.data);
  };

  return (
    <Layout>
      {isLoggedIn && (
        <>
          <Modal
            isOpen={isOpenTextModal}
            onRequestClose={() => setIsOpenTextModal(false)}
            style={{
              content: {
                width: "calc(100% - 32px)",
                borderRadius: "8px",
                height: "min-content",
                maxHeight: "calc(100% - 32px)",
                background: "white",
                margin: "16px 16px auto 16px",
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
            <InfoCircleIcon size={52} className="mx-auto" />
            <p className="mt-10px uppercase font-semibold text-center">
              {textCouponTitle}
            </p>
            <div className="my-4 h-px w-full bg-sky-50"></div>
            <div className="flex flex-col am-gapY-20px">
              {textCouponContent.map((c, _idx) => (
                <div dangerouslySetInnerHTML={{ __html: c }} key={_idx} />
              ))}
            </div>
            <div className="sticky bottom-0 bg-white pb-6">
              <div className="h-px w-full bg-sky-60 my-4"></div>
              <ButtonBase
                onClick={() => setIsOpenTextModal(false)}
                status="active"
              >
                {t("common.understand")}
              </ButtonBase>
            </div>
          </Modal>
          <div className="lg:mt-8 pb-10 lg:pb-0">
            <div className="flex">
              <div className="hidden lg:block py-6 px-4 rounded-lg shadow-custom-1 w-336px h-fit mr-8">
                <InfoCircleIcon size={52} className="mx-auto" />
                <p className="my-10px uppercase font-semibold text-center">
                  {textCouponTitle}
                </p>
                <div className="flex flex-col am-gapY-20px">
                  {textCouponContent.map((c, _idx) => (
                    <div dangerouslySetInnerHTML={{ __html: c }} />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
                  <LeftIcon
                    className="absolute cursor-pointer left-4 top-5"
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🏷️</span>
                    <p>{t("common.coupons")}</p>
                  </div>
                </div>
                <div className="px-4 lg:hidden">
                  <ButtonBase
                    status="active"
                    onClick={() => setIsOpenTextModal(true)}
                    style="secondary"
                  >
                    <div className="flex items-center justify-center">
                      <p className="uppercase text-xs mr-3">
                        {t("product.how_work")}
                      </p>
                      <InfoCircleIcon />
                    </div>
                  </ButtonBase>
                </div>
                <div className="hidden lg:block p-4 text-2xl font-semibold">
                  {t("common.coupons")}
                </div>
                {!isLoading && coupons.length === 0 && (
                  <p className="mt-4 text-neutral-400 lg:mt-0 text-center leading-5 font-medium">
                    {t("common.no_data")}
                  </p>
                )}
                <div className="px-4 lg:px-0 mt-4 lg:mt-0">
                  {(isLoading || coupons.length > 0) && (
                    <p
                      style={{ paddingTop: "7px", paddingBottom: "2px" }}
                      className="lg:pl-4 font-medium leading-none"
                    >
                      {t("common.active")}
                    </p>
                  )}
                  <div className="mt-2 lg:mt-4 flex flex-col am-gapY-8px am-lg-gapY-16px">
                    {isLoading &&
                      Array(3)
                        .fill(0)
                        .map((_, _idx) => (
                          <CouponCard key={_idx} isLoading={true} />
                        ))}
                    {!isLoading &&
                      coupons
                        .filter((c) => c.status === "active")
                        .map((c, _idx) => <CouponCard key={_idx} data={c} />)}
                  </div>
                  {(isLoading || coupons.length > 0) && (
                    <p
                      style={{ paddingTop: "7px", paddingBottom: "2px" }}
                      className="lg:pl-4 font-medium leading-none mt-4"
                    >
                      {t("common.inactive")}
                    </p>
                  )}
                  <div className="mt-2 lg:mt-4 flex flex-col am-gapY-8px am-lg-gapY-16px">
                    {isLoading &&
                      Array(3)
                        .fill(0)
                        .map((_, _idx) => (
                          <CouponCard key={_idx} isLoading={true} />
                        ))}
                    {!isLoading &&
                      coupons
                        .filter((c) => c.status === "usage")
                        .map((c, _idx) => <CouponCard key={_idx} data={c} />)}
                  </div>
                </div>
                {pageCount > 1 && (
                  <div className="hidden lg:block pt-8 pb-4">
                    <Paginator
                      onClickPage={onClickPage}
                      pageCount={pageCount}
                      pageNumber={pageNumber}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CouponsPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
