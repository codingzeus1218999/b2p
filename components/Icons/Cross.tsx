"use client";

import { iconPropsInterface } from "@/interfaces";

const CrossIcon: React.FC<iconPropsInterface> = ({
  size = 20,
  fill = "#ababad",
  className,
  onClick,
}) => {
  return (
    <>
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
            d="M6.06694 5.18306C5.82286 4.93898 5.42714 4.93898 5.18306 5.18306C4.93898 5.42714 4.93898 5.82286 5.18306 6.06694L9.11612 10L5.18306 13.9331C4.93898 14.1771 4.93898 14.5729 5.18306 14.8169C5.42714 15.061 5.82286 15.061 6.06694 14.8169L10 10.8839L13.9331 14.8169C14.1771 15.061 14.5729 15.061 14.8169 14.8169C15.061 14.5729 15.061 14.1771 14.8169 13.9331L10.8839 10L14.8169 6.06694C15.061 5.82286 15.061 5.42714 14.8169 5.18306C14.5729 4.93898 14.1771 4.93898 13.9331 5.18306L10 9.11612L6.06694 5.18306Z"
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
            d="M18.75 6.81984L17.1802 5.25L12 10.4302L6.81984 5.25L5.25 6.81984L10.4302 12L5.25 17.1802L6.81984 18.75L12 13.5698L17.1802 18.75L18.75 17.1802L13.5698 12L18.75 6.81984Z"
            fill={fill}
          />
        </svg>
      )}
    </>
  );
};

export default CrossIcon;
