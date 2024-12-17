"use client";

import { iconPropsInterface } from "@/interfaces";

const LeftIcon: React.FC<iconPropsInterface> = ({
  fill = "#191c1f",
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
        d="M9.33333 10.7626L14.5774 5.25628C14.9028 4.91457 15.4305 4.91457 15.7559 5.25628C16.0814 5.59799 16.0814 6.15201 15.7559 6.49372L10.5118 12L15.7559 17.5063C16.0814 17.848 16.0814 18.402 15.7559 18.7437C15.4305 19.0854 14.9028 19.0854 14.5774 18.7437L9.33333 13.2374L8 12L9.33333 10.7626Z"
        fill={fill}
      />
    </svg>
  );
};

export default LeftIcon;
