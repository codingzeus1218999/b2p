"use client";

import { iconPropsInterface } from "@/interfaces";

const CheckboxCheckedIcon: React.FC<iconPropsInterface> = ({
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <path
        d="M17.36 5C17.9578 5 18.2568 5 18.4818 5.12369C18.648 5.21511 18.7849 5.35196 18.8763 5.51825C19 5.74324 19 6.04216 19 6.64V17.36C19 17.9578 19 18.2568 18.8763 18.4818C18.7849 18.648 18.648 18.7849 18.4818 18.8763C18.2568 19 17.9578 19 17.36 19H6.64C6.04216 19 5.74324 19 5.51825 18.8763C5.35196 18.7849 5.21511 18.648 5.12369 18.4818C5 18.2568 5 17.9578 5 17.36V6.64C5 6.04216 5 5.74324 5.12369 5.51825C5.21511 5.35196 5.35196 5.21511 5.51825 5.12369C5.74324 5 6.04216 5 6.64 5H17.36ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
        fill="#ABABAD"
      />
      <rect x="7" y="7" width="10" height="10" rx="2" fill="#4791DB" />
    </svg>
  );
};

export default CheckboxCheckedIcon;
