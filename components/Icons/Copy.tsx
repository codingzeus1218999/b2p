"use client";

import { iconPropsInterface } from "@/interfaces";

const CopyIcon: React.FC<iconPropsInterface> = ({
  size = 20,
  className,
  onClick,
  fill = "#7fb0e0",
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
            d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.17187 12.5013H3.33854C2.89651 12.5013 2.47259 12.3257 2.16003 12.0131C1.84747 11.7006 1.67188 11.2767 1.67188 10.8346V3.33464C1.67187 2.89261 1.84747 2.46868 2.16003 2.15612C2.47259 1.84356 2.89651 1.66797 3.33854 1.66797H10.8385C11.2806 1.66797 11.7045 1.84356 12.0171 2.15612C12.3296 2.46868 12.5052 2.89261 12.5052 3.33464V4.16797"
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {size === 16 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
        >
          <g clipPath="url(#clip0_9395_167486)">
            <path
              d="M13.3333 6.88379H7.33333C6.59695 6.88379 6 7.48074 6 8.21712V14.2171C6 14.9535 6.59695 15.5505 7.33333 15.5505H13.3333C14.0697 15.5505 14.6667 14.9535 14.6667 14.2171V8.21712C14.6667 7.48074 14.0697 6.88379 13.3333 6.88379Z"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33594 10.8864H2.66927C2.31565 10.8864 1.97651 10.7459 1.72646 10.4959C1.47641 10.2458 1.33594 9.90668 1.33594 9.55306V3.55306C1.33594 3.19944 1.47641 2.8603 1.72646 2.61025C1.97651 2.3602 2.31565 2.21973 2.66927 2.21973H8.66927C9.02289 2.21973 9.36203 2.3602 9.61208 2.61025C9.86213 2.8603 10.0026 3.19944 10.0026 3.55306V4.21973"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_9395_167486">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0 0.883789)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
    </>
  );
};

export default CopyIcon;
