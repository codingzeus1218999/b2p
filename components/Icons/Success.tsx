"use client";

import { iconPropsInterface } from "@/interfaces";

const SuccessIcon: React.FC<iconPropsInterface> = ({
  fill = "#04cc00",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2098 5.40905L8.29698 17.8809L2.78906 12.373L4.12594 11.0361L8.20489 15.1151L17.787 4.16406L19.2098 5.40905Z"
        fill={fill}
      />
    </svg>
  );
};

export default SuccessIcon;
