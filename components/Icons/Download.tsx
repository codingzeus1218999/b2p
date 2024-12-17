"use client";

import { iconPropsInterface } from "@/interfaces";

const DownloadIcon: React.FC<iconPropsInterface> = ({
  className,
  onClick,
  fill = "white",
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
        d="M12 15.577L8.462 12.038L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.538 12.038L12 15.577ZM6.615 19C6.155 19 5.771 18.846 5.463 18.538C5.15433 18.2293 5 17.845 5 17.385V14.962H6V17.385C6 17.5383 6.064 17.6793 6.192 17.808C6.32067 17.936 6.46167 18 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.936 17.6793 18 17.5383 18 17.385V14.962H19V17.385C19 17.845 18.846 18.229 18.538 18.537C18.2293 18.8457 17.845 19 17.385 19H6.615Z"
        fill={fill}
      />
    </svg>
  );
};

export default DownloadIcon;
