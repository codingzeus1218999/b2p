"use client";

import { iconPropsInterface } from "@/interfaces";

const DropdownCloseIcon: React.FC<iconPropsInterface> = ({
  fill = "#b1b1b1",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <path d="M0 0L4 4L8 0H0Z" fill={fill} />
    </svg>
  );
};

export default DropdownCloseIcon;
