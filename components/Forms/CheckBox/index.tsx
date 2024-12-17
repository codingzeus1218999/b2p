"use client";

import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from "@/components/Icons";
import { CheckBoxProps } from "@/interfaces";

const CheckBox: React.FC<CheckBoxProps> = ({ children, value, onChange }) => {
  return (
    <div className="h-11 flex items-center">
      {value ? (
        <CheckboxCheckedIcon
          className="cursor-pointer"
          onClick={() => onChange(false)}
        />
      ) : (
        <CheckboxUncheckedIcon
          className="cursor-pointer"
          onClick={() => onChange(true)}
        />
      )}
      <div className="cursor-pointer ml-2" onClick={() => onChange(!value)}>
        {children}
      </div>
    </div>
  );
};

export default CheckBox;
