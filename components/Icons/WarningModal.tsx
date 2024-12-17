"use client";

import { iconPropsInterface } from "@/interfaces";

const WarningModalIcon: React.FC<iconPropsInterface> = ({
  className,
  onClick,
  fill = "#d7d7d7",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="44"
      viewBox="0 0 52 44"
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
        d="M25.8553 12.43L38.9337 35.0263H12.7768L25.8553 12.43ZM25.8553 5.5L6.75 38.5H44.9605L25.8553 5.5Z"
        fill={fill}
      />
      <path d="M27.5921 29.8158H24.1184V33.2895H27.5921V29.8158Z" fill={fill} />
      <path d="M27.5921 19.3947H24.1184V28.0789H27.5921V19.3947Z" fill={fill} />
    </svg>
  );
};

export default WarningModalIcon;
