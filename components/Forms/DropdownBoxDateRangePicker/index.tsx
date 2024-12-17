"use client";

import {
  CloseCircleIcon,
  DropdownCloseIcon,
  DropdownOpenIcon,
} from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxDateRangePickerProps } from "@/interfaces";
import classNames from "classnames";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";

const DropdownBoxDateRangePicker: React.FC<DropdownBoxDateRangePickerProps> = ({
  label,
  startD,
  endD,
  onChangeRange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const { setBlur } = useContext(BlurContext);
  const { dropdownOpen, isSelf, setIsSelf } = useContext(DropdownOpenContext);

  const dateRangeTitle = useMemo(() => {
    if (startD || endD) {
      let label;

      if (startD) label = `${moment(startD).format("DD.MM.YYYY")} —`;
      if (endD) label += moment(endD).format("DD.MM.YYYY");

      return label;
    }

    return null;
  }, [startD, endD]);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    onChangeRange(start, end);
  };

  useOnClickOutside(ref, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (isSelf) {
      setBlur(true);
      setTimeout(() => {
        setIsSelf(false);
      }, 100);
    } else {
      setBlur(isOpen);
    }
  }, [isOpen]);

  const initializeValue = () => {
    onChangeRange(undefined, undefined);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={ref}>
      <div
        className={classNames(
          "cursor-pointer min-h-9 px-3 justify-between flex items-center am-gapX-8px rounded-xl",
          {
            "bg-sky-50": !isOpen,
            "bg-gray-300": isOpen,
            "text-sky-600": dateRangeTitle || isOpen,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p
          className={classNames(
            "whitespace-nowrap flex-1 overflow-hidden text-sm"
          )}
        >
          {dateRangeTitle ? dateRangeTitle : label}
        </p>
        {dateRangeTitle ? (
          <CloseCircleIcon onClick={initializeValue} />
        ) : isOpen ? (
          <DropdownOpenIcon />
        ) : (
          <DropdownCloseIcon />
        )}
      </div>
      {isOpen && (
        <div className="absolute top-10 right-0 bg-white z-40 rounded-xl shadow-custom-5 p-3">
          <DatePicker
            onChange={onChange}
            startDate={startD}
            endDate={endD}
            selectsRange
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DropdownBoxDateRangePicker;
