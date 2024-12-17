"use client";

import { iconPropsInterface } from "@/interfaces";

const CollapseIcon: React.FC<iconPropsInterface> = ({
  fill = "#b1b1b1",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <path d="M4 6L0.535898 6.52533e-07L7.4641 4.68497e-08L4 6Z" fill={fill} />
    </svg>
  );
};

export default CollapseIcon;
