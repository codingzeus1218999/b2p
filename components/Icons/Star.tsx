"use client";

import { iconPropsInterface } from "@/interfaces";

const StarIcon: React.FC<iconPropsInterface> = ({
  fill,
  className,
  onClick,
  size,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <>
      {size === 24 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="22"
          viewBox="0 0 24 22"
          fill="none"
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <path
            d="M11.5789 17.6811L18.7347 22L16.8358 13.86L23.1579 8.38316L14.8326 7.67684L11.5789 0L8.32526 7.67684L0 8.38316L6.32211 13.86L4.42316 22L11.5789 17.6811Z"
            fill={fill}
            style={{ transition: "fill 0.3s" }}
          />
        </svg>
      )}
      {size === 20 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <path
            d="M9.6314 14.4663L15.4861 18L13.9325 11.34L19.1051 6.85895L12.2935 6.28105L9.6314 0L6.96929 6.28105L0.157715 6.85895L5.33035 11.34L3.77666 18L9.6314 14.4663Z"
            fill={fill}
            style={{ transition: "fill 0.3s" }}
          />
        </svg>
      )}
      {size === 18 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <path
            d="M9.21012 12.8599L14.4143 16.001L13.0333 10.081L17.6312 6.09782L11.5764 5.58413L9.21012 0.000976562L6.8438 5.58413L0.789062 6.09782L5.38696 10.081L4.0059 16.001L9.21012 12.8599Z"
            fill={fill}
            style={{ transition: "fill 0.3s" }}
          />
        </svg>
      )}
      {size === 16 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <path
            d="M8.31569 11.2516L12.8694 14L11.661 8.82L15.6841 5.33474L10.3862 4.88526L8.31569 0L6.24516 4.88526L0.947266 5.33474L4.97042 8.82L3.762 14L8.31569 11.2516Z"
            fill={fill}
            style={{ transition: "fill 0.3s" }}
          />
        </svg>
      )}
      {size === 13 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <path
            d="M6.57751 10.6051L10.4807 12.9609L9.44488 8.52094L12.8933 5.53357L8.35225 5.14831L6.57751 0.960938L4.80277 5.14831L0.261719 5.53357L3.71014 8.52094L2.67435 12.9609L6.57751 10.6051Z"
            fill={fill}
            style={{ transition: "fill 0.3s" }}
          />
        </svg>
      )}
    </>
  );
};

export default StarIcon;
