"use client";

import { iconPropsInterface } from "@/interfaces";

const CrossCircleIcon: React.FC<iconPropsInterface> = ({
  fill = "white",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <rect width="28" height="28" rx="14" fill="white" fillOpacity="0.08" />
      <path
        d="M19 10.1628L17.8372 9L14 12.8372L10.1628 9L9 10.1628L12.8372 14L9 17.8372L10.1628 19L14 15.1628L17.8372 19L19 17.8372L15.1628 14L19 10.1628Z"
        fill={fill}
      />
    </svg>
  );
};

export default CrossCircleIcon;
