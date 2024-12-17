"use client";

import { FormTabProps } from "@/interfaces";

const FormTab: React.FC<FormTabProps> = ({ activeItem, list, onClickTab }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {list.map((l, _idx) => (
        <div
          key={_idx}
          className={`cursor-pointer text-center text-base leading-8 ${
            activeItem.value === l.value
              ? "text-sky-600 border-b-2 border-sky-600"
              : ""
          }`}
          onClick={() => onClickTab(l)}
        >
          {l.title}
        </div>
      ))}
    </div>
  );
};

export default FormTab;
