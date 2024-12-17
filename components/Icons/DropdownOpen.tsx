"use client";

import { iconPropsInterface } from "@/interfaces";

const DropdownOpenIcon: React.FC<iconPropsInterface> = ({
  fill = "#1976d2",
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
      <path d="M0 4L4 0L8 4H0Z" fill={fill} />
    </svg>
  );
};

export default DropdownOpenIcon;
