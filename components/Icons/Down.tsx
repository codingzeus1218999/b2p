"use client";

import { iconPropsInterface } from "@/interfaces";

const DownIcon: React.FC<iconPropsInterface> = ({
  fill = "#1976d2",
  size = 8,
  className,
  onClick,
}) => {
  return (
    <>
      {size === 8 && (
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
          <path
            d="M8 0.5L4 5.5L0 0.5L1.456 0.5L4 3.73182L6.544 0.5L8 0.5Z"
            fill={fill}
          />
        </svg>
      )}
      {size === 20 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.37465 5.8623L9.99965 11.4873L15.6247 5.8623L16.9505 7.18813L9.99965 14.139L3.04883 7.18813L4.37465 5.8623Z"
            fill={fill}
          />
        </svg>
      )}
      {size === 24 && (
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
            d="M12.8839 14L16.8169 10.0669C17.061 9.82286 17.061 9.42714 16.8169 9.18306C16.5729 8.93898 16.1771 8.93898 15.9331 9.18306L12 13.1161L8.06694 9.18306C7.82286 8.93898 7.42714 8.93898 7.18306 9.18306C6.93898 9.42714 6.93898 9.82286 7.18306 10.0669L11.1161 14L12 15L12.8839 14Z"
            fill={fill}
          />
        </svg>
      )}
    </>
  );
};

export default DownIcon;
