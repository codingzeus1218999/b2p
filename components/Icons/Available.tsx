"use client";

import { iconPropsInterface } from "@/interfaces";

const AvailableIcon: React.FC<iconPropsInterface> = ({
  fill = "#04cc00",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
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
        d="M13.9736 3.93474L6.03701 13.0052L2.03125 8.99942L3.00352 8.02714L5.97003 10.9937L12.9388 3.0293L13.9736 3.93474Z"
        fill={fill}
      />
    </svg>
  );
};

export default AvailableIcon;
