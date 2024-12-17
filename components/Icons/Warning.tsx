"use client";

import { iconPropsInterface } from "@/interfaces";

const WarningIcon: React.FC<iconPropsInterface> = ({
  fill = "#ffd05e",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
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
        d="M11.0003 5.94949L17.9028 17.8753H4.09783L11.0003 5.94949ZM11.0003 2.29199L0.916992 19.7087H21.0837L11.0003 2.29199Z"
        fill={fill}
      />
      <path d="M11.917 15.1253H10.0837V16.9587H11.917V15.1253Z" fill={fill} />
      <path d="M11.917 9.62533H10.0837V14.2087H11.917V9.62533Z" fill={fill} />
    </svg>
  );
};

export default WarningIcon;
