"use client";

import { iconPropsInterface } from "@/interfaces";

const HeartIcon: React.FC<iconPropsInterface> = ({
  fill,
  onClick,
  className,
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
        d="M12 21.707C12.2569 21.707 12.6324 21.5043 12.9387 21.3015C18.4625 17.6515 22 13.373 22 9.04374C22 5.30255 19.4802 2.70703 16.3281 2.70703C14.3617 2.70703 12.8893 3.82229 12 5.48505C11.1304 3.82229 9.64822 2.70703 7.68182 2.70703C4.51976 2.70703 2 5.30255 2 9.04374C2 13.373 5.54743 17.6515 11.0613 21.3015C11.3676 21.5043 11.7431 21.707 12 21.707Z"
        fill={fill}
      />
    </svg>
  );
};

export default HeartIcon;
