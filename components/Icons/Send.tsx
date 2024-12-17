"use client";

import { iconPropsInterface } from "@/interfaces";

const SendIcon: React.FC<iconPropsInterface> = ({
  className,
  onClick,
  fill = "#75ade4",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      style={{ minWidth: "33px" }}
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <path
        d="M9.4262 8.00046C9.2743 8.00616 9.13322 8.08049 9.0427 8.2027C8.95229 8.32481 8.92227 8.48151 8.96133 8.62838L10.6274 14.8729L17.9843 15.999L10.6285 17.124L8.96148 23.3703C8.92788 23.4952 8.94406 23.6284 9.00657 23.7415C9.06918 23.8548 9.17309 23.9395 9.29675 23.9777C9.42031 24.0159 9.55391 24.0047 9.66943 23.9465L24.6701 16.4461C24.7812 16.3903 24.8673 16.2953 24.9121 16.1794C24.9568 16.0635 24.9568 15.9352 24.9121 15.8193C24.8673 15.7034 24.7812 15.6084 24.6701 15.5525L9.66943 8.05221C9.59409 8.01471 9.51038 7.99696 9.42633 8.00042L9.4262 8.00046Z"
        fill={fill}
      />
    </svg>
  );
};

export default SendIcon;
