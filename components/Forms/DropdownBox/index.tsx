"use client";

import { DropdownCloseIcon, DropdownOpenIcon } from "@/components/Icons";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxProps } from "@/interfaces";
import classNames from "classnames";
import React, { useContext, useEffect, useRef, useState } from "react";

const DropdownBox: React.FC<DropdownBoxProps> = ({
  label,
  list,
  activeItem,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const { dropdownOpen, isSelf, setIsSelf } = useContext(DropdownOpenContext);
  const [horveredIndex, setHorveredIndex] = useState<number>(0);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    if (isSelf) {
      setTimeout(() => {
        setIsSelf(false);
      }, 100);
    }
  }, [isOpen]);

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
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p
          className={classNames(
            "whitespace-nowrap flex-1 overflow-hidden text-sm",
            {
              "text-sky-600": activeItem,
            }
          )}
        >
          {activeItem ? activeItem.label : label}
        </p>
        {isOpen ? <DropdownOpenIcon /> : <DropdownCloseIcon />}
      </div>
      {isOpen && list.length > 0 && (
        <div
          className={`flex flex-col absolute top-10 bg-white z-40 shadow-custom-5 left-0 w-full rounded-xl`}
        >
          {list.map((l, _idx) => (
            <div
              className={classNames(
                "cursor-pointer text-sm leading-4 px-3 py-13px dropdownbox-item-1",
                {
                  active: l.value === activeItem?.value,
                  "has-border":
                    _idx !== list.length - 1 &&
                    (_idx !== 0 || (_idx === 0 && !activeItem)),
                  "border-change": _idx === horveredIndex - 1,
                }
              )}
              onMouseEnter={() => setHorveredIndex(_idx)}
              onMouseLeave={() => setHorveredIndex(0)}
              key={_idx}
              onClick={() => {
                setIsOpen(false);
                if (l.value === activeItem?.value) return;
                onChange(l);
              }}
            >
              {l.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownBox;
