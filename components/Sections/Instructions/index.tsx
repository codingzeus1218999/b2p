"use client";

import {
  InstructionStepProps,
  InstructionTabsProps,
  instructionsDataInterface,
} from "@/interfaces";
import ImgAndroid from "@/public/images/Android.svg";
import ImgApple from "@/public/images/Apple.svg";
import ImgHuawei from "@/public/images/Huawei.svg";
import ImgClose from "@/public/images/close.svg";
import ImgOpen from "@/public/images/open.svg";
import { fetchInstructions } from "@/services/instructionsApi";
import { mapInstructionsData } from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const InstructionStep: React.FC<InstructionStepProps> = ({
  step,
  stepNumber,
  platform,
}) => {
  if (!step) return null;
  const t = useTranslations();

  return (
    <div className="flex flex-[1_0_100%] lg:flex-[1_0_49%] flex-col animate-fadeIn">
      <div className="grow">
        <div
          className={`tabs-${platform} flex justify-center lg:justify-start relative`}
        >
          <div className="flex-col w-full lg:flex absolute lg:relative top-4 mr-5">
            <div className="flex flex-col px-5 lg:px-0">
              <h2 className="text-base font-medium text-zinc-900 hidden lg:block">
                {t("common.step")} {stepNumber}
              </h2>
              <span className="text-xs lg:hidden text-neutral-400">
                {stepNumber}.
              </span>
              <p className="mt-1.5 text-base leading-5 hidden lg:block">
                {step.header}
              </p>
              {step.qr_code && (
                <div className="flex-col justify-center p-3.5 mt-3 rounded-xl bg-[#EEF1F8] w-32 hidden lg:block">
                  <img
                    src={step.qr_code}
                    alt={`QR Code Step ${stepNumber}`}
                    width={100}
                    height={100}
                    className="shrink-0 bg-white rounded h-[100px]"
                  />
                </div>
              )}
              <p className="mt-1.5 text-base leading-5 hidden lg:block">
                {step.footer}
              </p>
            </div>
          </div>
          <div className="flex flex-col bg-[#EEF1F8] px-3 lg:px-0 pt-4 lg:pt-0 lg:bg-none lg:w-full rounded lg:rounded-none">
            <img
              src={step.image}
              alt={`Step ${stepNumber} Image`}
              width={260}
              height={278}
              className="grow w-[176px] lg:w-full h-189px lg:h-277px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionTabs: React.FC<InstructionTabsProps> = ({
  instructions,
  platform,
}) => {
  if (
    !instructions ||
    !instructions[platform] ||
    !Array.isArray(instructions[platform])
  )
    return null;

  const steps = instructions[platform];

  return (
    <>
      {steps.map((step, index) => (
        <InstructionStep
          key={index}
          step={step}
          stepNumber={index + 1}
          platform={platform}
        />
      ))}
    </>
  );
};

const Instructions: React.FC = () => {
  const t = useTranslations();
  const [instructions, setInstructions] =
    useState<instructionsDataInterface | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("android");
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (): Promise<void> => {
    try {
      const data = mapInstructionsData(await fetchInstructions());
      setInstructions(data);
    } catch (err) {
      console.log("Error fetching the initial data");
    }
  };

  return (
    <div className="px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div>
          <div className="flex justify-between items-center">
            <div className="lg:pt-8">
              <div className="font-medium text-xl">{instructions?.title}</div>
              <div className="text-xs lg:text-sm text-neutral-400">
                {t("home.smartphone")}
              </div>
              <div className="mt-3 flex items-center am-gapX-11px">
                <Image
                  alt="Apple"
                  width={36}
                  height={36}
                  src={ImgApple}
                  className="h-9 w-9 flex-shrink-0 rounded-md"
                />
                <Image
                  alt="Android"
                  width={36}
                  height={36}
                  src={ImgAndroid}
                  className="h-9 w-9 flex-shrink-0 rounded-md"
                />
                <Image
                  alt="Huawei"
                  width={36}
                  height={36}
                  src={ImgHuawei}
                  className="h-9 w-9 flex-shrink-0 rounded-md"
                />
              </div>
            </div>
            <div className="lg:hidden ml-3">
              {instructions?.image && (
                <img
                  alt="Instructions"
                  src={instructions.image}
                  width={114}
                  height={114}
                />
              )}
            </div>
          </div>
          <div className="mt-3 text-xs leading-[18px] lg:text-base">
            {instructions?.description}
          </div>
          <div
            className={`flex items-center mt-3 lg:mt-8 lg:pb-0 ${
              showInstructions ? "" : "pb-9"
            }`}
          >
            <label
              className="cursor-pointer flex h-2.5 w-44 flex-shrink-0 items-center text-sm leading-4 text-sky-600 mr-1"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {t("home.installation_instructions")}
            </label>
            <div className="flex h-[9px] w-2.5 flex-shrink-0 flex-col items-center pt-[7.9e-8px]">
              {showInstructions ? (
                <Image
                  alt="open"
                  width={331}
                  height={228}
                  src={ImgOpen}
                  className="h-[9px] w-2.5 flex-shrink-0"
                />
              ) : (
                <Image
                  alt="close"
                  width={331}
                  height={228}
                  src={ImgClose}
                  className="h-[9px] w-2.5 flex-shrink-0"
                />
              )}
            </div>
          </div>
          {showInstructions && (
            <div className="lg:flex lg:w-[264px] am-gapX-8px am-lg-gapX-4px mb-2 text-sm tracking-tight leading-5 text-center whitespace-nowrap hidden mt-4">
              <div
                className={`flex flex-[1_0_49%] flex-col cursor-pointer justify-center px-4 py-1.5 ${
                  selectedPlatform === "android"
                    ? "rounded-lg bg-sky-50 text-neutral-900"
                    : "text-zinc-900"
                }`}
                onClick={() => setSelectedPlatform("android")}
              >
                {t("common.android")}
              </div>
              <div
                className={`flex flex-[1_0_49%] flex-col cursor-pointer justify-center px-4 py-1.5 ${
                  selectedPlatform === "iphone"
                    ? "rounded-lg bg-sky-50 text-neutral-900"
                    : "text-zinc-900"
                }`}
                onClick={() => setSelectedPlatform("iphone")}
              >
                {t("common.iphone")}
              </div>
            </div>
          )}
        </div>
        <div className="hidden lg:block lg:pl-14">
          {instructions?.image && (
            <img
              alt="Instructions"
              src={instructions.image}
              width={352}
              height={352}
              className="z-[1] flex-shrink-0"
            />
          )}
        </div>
      </div>
      {showInstructions && (
        <section className="lg:mt-6 lg:block lg:px-0 pb-9 lg:pb-0 animate-fadeIn">
          <div className="flex am-gapY-16px flex-col lg:flex-row am-lg-gapX-20px flex-wrap mt-4 lg:mt-0">
            <div className="flex lg:w-[264px] am-gapX-8px am-lg-gapX-4px mb-2 text-sm tracking-tight leading-5 text-center whitespace-nowrap lg:hidden">
              <div
                className={`flex flex-[1_0_49%] flex-col cursor-pointer justify-center px-4 py-1.5 ${
                  selectedPlatform === "android"
                    ? "rounded-lg bg-sky-50 text-neutral-900"
                    : "text-zinc-900"
                }`}
                onClick={() => setSelectedPlatform("android")}
              >
                {t("common.android")}
              </div>
              <div
                className={`flex flex-[1_0_49%] flex-col cursor-pointer justify-center px-4 py-1.5 ${
                  selectedPlatform === "iphone"
                    ? "rounded-lg bg-sky-50 text-neutral-900"
                    : "text-zinc-900"
                }`}
                onClick={() => setSelectedPlatform("iphone")}
              >
                {t("common.iphone")}
              </div>
            </div>
            <div className="gap-4 w-full grid grid-cols-1 lg:grid-cols-2">
              {selectedPlatform === "android" && instructions && (
                <InstructionTabs
                  instructions={instructions.platforms}
                  platform="android"
                />
              )}
              {selectedPlatform === "iphone" && instructions && (
                <InstructionTabs
                  instructions={instructions.platforms}
                  platform="iphone"
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Instructions;
