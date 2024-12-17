"use client";

import { iconPropsInterface } from "@/interfaces";

const FavoriteIcon: React.FC<iconPropsInterface> = ({
  fill = "none",
  className,
  pathClassName,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill={fill}
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <path
        d="M4.43169 0.417436C5.85596 -0.187277 7.54805 -0.135834 8.9234 0.577314C9.50391 0.86227 10.0173 1.26928 10.4667 1.73126C10.9161 1.26978 11.4295 0.86227 12.01 0.577314C13.3854 -0.135834 15.0775 -0.187277 16.5012 0.417436C18.0788 1.08771 19.3014 2.51804 19.7618 4.16373C20.2677 5.86994 19.9494 7.78192 18.9781 9.2647C18.5832 9.88 18.0682 10.4015 17.5604 10.922C15.2479 13.3333 12.825 15.6341 10.4667 18C8.23547 15.7597 5.9417 13.5819 3.74577 11.3063C3.22327 10.753 2.65991 10.2336 2.2055 9.62027C1.09492 8.15917 0.661185 6.18969 1.10703 4.4043C1.51656 2.65825 2.77591 1.11999 4.43169 0.417436Z"
        className={pathClassName}
      />
    </svg>
  );
};

export default FavoriteIcon;
