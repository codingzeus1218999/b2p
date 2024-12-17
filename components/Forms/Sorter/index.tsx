"use client";

import { SortIcon } from "@/components/Icons";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { SorterProps, dropdownItemInterface } from "@/interfaces";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

const Sorter: React.FC<SorterProps> = ({
  position = "left",
  activeSortItem,
  list,
  onChange,
  left,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSortItem, setSelectedSortItem] =
    useState<dropdownItemInterface>();
  const ref = useRef(null);
  useEffect(() => {
    if (activeSortItem) setSelectedSortItem(activeSortItem);
  }, [activeSortItem]);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className="relative lg:flex lg:items-center lg:h-8" ref={ref}>
      <SortIcon
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        fill={isOpen ? "#1976D2" : "#B1B1B1"}
      />
      <div
        className={classNames(
          `overflow-hidden z-10 absolute top-[26px] lg:top-[38px] right-0 shadow-[8px_12px_32px_0px_rgba(25,118,210,0.32)] bg-white w-[136px] rounded-xl text-[14px]/[16px] transition-all duration-300 ease-in-out ${position === "left" ? 'origin-top-right':'origin-top-left'} ${
            isOpen? 'scale-110 opacity-100': 'scale-75 opacity-0'}`,
          {
            "right-0": position === "left",
            "left-0": position === "right",
          }
        )}
        style={left !== undefined ? { left: left + "px" } : {}}
      >
        {list.map((l, _idx) => (
          <div
            className={classNames(
              "py-4 px-3 hover:text-sky-600 hover:bg-sky-100 cursor-pointer",
              {
                "text-sky-600 bg-sky-100": selectedSortItem?.value === l.value,
              }
            )}
            onClick={() => {
              if (selectedSortItem?.value !== l.value) {
                onChange(l);
              }
              setIsOpen(false);
            }}
            key={_idx}
          >
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sorter;
