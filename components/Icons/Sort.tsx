"use client";

import { iconPropsInterface } from "@/interfaces";

const SortIcon: React.FC<iconPropsInterface> = ({
  fill,
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={className}
      style={{ fill }}
    >
      <path d="M19.375 4.6875H0.625V6.5625H19.375V4.6875Z" />
      <path d="M16.25 9.0625H3.75V10.9375H16.25V9.0625Z" />
      <path d="M12.5 13.4375H7.5V15.3125H12.5V13.4375Z" />
    </svg>
  );
};

export default SortIcon;
