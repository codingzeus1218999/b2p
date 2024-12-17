"use client";

import { ButtonBase } from "@/components/Forms";
import {
  AndroidIcon,
  AppleIcon,
  DownIcon,
  DownloadIcon,
  LeftIcon,
  UpIcon,
} from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { CopyIconButton } from "@/components/Units";
import { useAuth } from "@/context/AuthProvider";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function VPNPage() {
  const t = useTranslations();
  const [vpnUrl, setVpnUrl] = useState<string>(
    "vpn://eyJjb25620YWluZXJzIjpbeyJhd2ciOnsiSDEiOiIxMzI0NzUzNTc0IiwiSDIiOiIxMjcyODg0MjIzIiwiSDMiOiIxMzgzOTkxNjU4IiwiSDQiOiI2MDk0MjUwNzQiLCJKYyI6IjMiLCJKbWF4IjoiMTAwMCIsIkptaW4iOiI1MCIsIlMxIjoiNjMiLCJTMiI6IjY2IiwibGFzdF9jb25maWciOiJ7XCJIMVwiOlwiMTMyNDc1MzU3NFwiLFwiSDJcIjpcIjEyNzI4ODQyMjNcIixcIkgzXCI6XCIxMzgzOTkxNjU4XCIsXCJINFwiOlwiNjA5NDI1MDc0XCIsXCJKY1wiOlwiM1wiLFwiSm1heFwiOlwiMTAwMFwiLFwiSm1pblwiOlwiNTBcIixcIlMxXCI6XCI2M1wiLFwiUzJcIjpcIjY2XCIsXCJjbGllbnRfaXBcIjpcIjEwLjguMS4xNFwiLFwiY2xpZW50X3ByaXZfa2V5XCI6XCIrQUR5MlAwS1JEVURxQjFuV24rKzhNZnEwQXRTa3JCajI2dWhidWdGUm1jPVwiLFwiY2xpZW50X3B1Yl9rZXlcIjpcIjFia2d3R3Y1QXMrb2JDYk9TUlZHVlNqNGc0K2RUMm5XeXJtS25mazd6Z2M9XCIsXCJjb25maWdcIjpcIltJbnRlcmZhY2VdXFxuQWRkcmVzcyA9IDEwLjguMS4xNC8zMlxcbkROUyA9IDUuNDUuODUuNCwgNS40NS45NC4yNDZcXG5Qcml2YXRlS2V5ID0gK0FEeTJQMEtSRFVEcUIxblduKys4TWZxMEF0U2tyQmoyNnVoYnVnRlJtYz1cXG5KYyA9IDNcXG5KbWluID0gNTBcXG5KbWF4ID0gMTAwMFxcblMxID0gNjNcXG5TMiA9IDY2XFxuSDEgPSAxMzI0NzUzNTc0XFxuSDIgPSAxMjcyODg0MjIzXFxuSDMgPSAxMzgzOTkxNjU4XFxuSDQgPSA2MDk0MjUwNzRcXG5cXG5bUGVlcl1cXG5QdWJsaWNLZXkgPSBldW5oKzY3bWRlZ2UrdVVNQkVEK1lEajlidFlKS3hOOTRNZW56VEVQQXd3PVxcblByZXNoYXJlZEtleSA9IDJ4ZDBWRjg3ZUpVc0Z3TWJuWXY5S3UyNkh4QzdKNSs5LzU5NnJrTzI1M289XFxuQWxsb3dlZElQcyA9IDAuMC4wLjAvMCwgOjovMFxcbkVuZHBvaW50ID0gMzcuMS4yMjIuMTMwOjU2NDdcXG5QZXJzaXN0ZW50S2VlcGFsaXZlID0gMjVcXG5cIixcImhvc3ROYW1lXCI6XCIzNy4xLjIyMi4xMzBcIixcInBvcnRcIjo1NjQ3LFwicHNrX2tleVwiOlwiMnhkMFZGODdlSlVzRndNYm5ZdjlLdTI2SHhDN0o1KzkvNTk2cmtPMjUzbz1cIixcInNlcnZlcl9wdWJfa2V5XCI6XCJldW5oKzY3bWRlZ2UrdVVNQkVEK1lEajlidFlKS3hOOTRNZW56VEVQQXd3PVwifSIsInBvcnQiOiI1NjQ3IiwidHJhbnNwb3J0X3Byb3RvIjoidWRwIn0sImNvbnRhaW5lciI6ImFtbmV6aWEtYXdnIn1dLCJkZWZhdWx0Q29udGFpbmVyIjoiYW1uZXppYS1hd2ciLCJkZXNjcmlwdGlvbiI6IlZQTiIsImRuczEiOiI1LjQ1Ljg1LjQiLCJkbnMyIjoiNS40NS45NC4yNDYiLCJob3N0TmFtZSI6IjM3LjEuMjIyLjEzMCJ9"
  );
  const [androidSteps, setAndroidSteps] = useState([
    {
      title: t("profile.step_1"),
      strings: [t("profile.step_1_1"), t("profile.step_1_2")],
    },
    {
      title: t("profile.step_2"),
      strings: [
        t("profile.step_2_1"),
        t("profile.step_2_2"),
        t("profile.step_2_3"),
        t("profile.step_2_4"),
        t("profile.step_2_5"),
        t("profile.step_2_6"),
        t("profile.step_2_7"),
        t("profile.step_2_8"),
      ],
    },
  ]);
  const [iphoneSteps, setIphoneSteps] = useState([
    {
      title: t("profile.step_1"),
      strings: [t("profile.step_1_1"), t("profile.step_1_2")],
    },
    {
      title: t("profile.step_2"),
      strings: [
        t("profile.step_2_1"),
        t("profile.step_2_2"),
        t("profile.step_2_3"),
        t("profile.step_2_4"),
        t("profile.step_2_5"),
        t("profile.step_2_6"),
        t("profile.step_2_7"),
        t("profile.step_2_8"),
      ],
    },
  ]);
  const [showAndroid, setShowAndroid] = useState<boolean>(false);
  const [showIphone, setShowIphone] = useState<boolean>(false);

  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) return;
  }, []);

  const onClickDownloadAPK = () => {
    console.log("TODO:// download apk file");
  };

  return (
    <Layout>
      {" "}
      {isLoggedIn && (
        <>
          <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
            <LeftIcon
              className="absolute cursor-pointer left-4 top-5"
              onClick={() => router.back()}
            />
            🧑🏻‍💻 {t("profile.personal_VPN")}
          </div>
          <div className="px-4 py-3 flex justify-between items-center border-b border-b-sky-50">
            <div className="flex-1 mr-2">
              <p className="text-xs leading-3 text-zinc-200">
                {t("profile.setup_key")}
              </p>
              <p
                className="mt-2 text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ width: "calc(min(100vw, 1088px) - 60px)" }}
              >
                {vpnUrl}
              </p>
            </div>
            <CopyIconButton val={vpnUrl} />
          </div>
          <div
            className="px-4 py-3 flex items-center justify-between cursor-pointer"
            onClick={() => setShowAndroid((prev) => !prev)}
          >
            <div className="flex items-center">
              <AndroidIcon />
              <div className="font-semibold ml-2">{t("common.android")}</div>
            </div>
            {showAndroid ? (
              <UpIcon className="mr-7px" size={10} />
            ) : (
              <DownIcon size={24} fill="#191C1F" />
            )}
          </div>
          {showAndroid && (
            <div className="p-4 flex flex-col am-gapY-12px">
              {androidSteps.map((as, _idx) => (
                <div key={_idx}>
                  <p className="text-sm font-semibold mb-3">{as.title}</p>
                  <div className="flex flex-col am-gapY-12px">
                    {as.strings.map((ss, _ix) => (
                      <div className="flex am-gapX-12px text-xs" key={_ix}>
                        <p>{_ix + 1}.</p>
                        <div>
                          <p>{ss}</p>
                          {_idx === 0 && _ix === 0 && (
                            <div className="mt-3" style={{ width: "170px" }}>
                              <ButtonBase
                                status="active"
                                onClick={onClickDownloadAPK}
                              >
                                <div className="flex items-center">
                                  <DownloadIcon />
                                  <p className="text-sm ml-2">
                                    {t("profile.download_apk")}
                                  </p>
                                </div>
                              </ButtonBase>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className={classNames(
              "px-4 py-3 flex items-center justify-between cursor-pointer border-t border-t-sky-50",
              { "border-b border-b-sky-50": !showIphone }
            )}
            onClick={() => setShowIphone((prev) => !prev)}
          >
            <div className="flex items-center">
              <AppleIcon />
              <div className="font-semibold ml-2">{t("common.iphone")}</div>
            </div>
            {showIphone ? (
              <UpIcon size={10} className="mr-7px" />
            ) : (
              <DownIcon fill="#191C1F" size={24} />
            )}
          </div>
          {showIphone && (
            <div className="p-4 flex flex-col am-gapY-12px border-b border-b-sky-50">
              {iphoneSteps.map((as, _idx) => (
                <div key={_idx}>
                  <p className="text-sm font-semibold mb-3">{as.title}</p>
                  <div className="flex flex-col am-gapY-12px">
                    {as.strings.map((ss, _ix) => (
                      <div className="flex am-gapX-12px text-xs" key={_ix}>
                        <p>{_ix + 1}.</p>
                        <div>
                          <p>{ss}</p>
                          {_idx === 0 && _ix === 0 && (
                            <div className="mt-3" style={{ width: "170px" }}>
                              <ButtonBase
                                status="active"
                                onClick={onClickDownloadAPK}
                              >
                                <div className="flex items-center">
                                  <DownloadIcon />
                                  <p className="text-sm ml-2">
                                    {t("profile.download_apk")}
                                  </p>
                                </div>
                              </ButtonBase>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default VPNPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
