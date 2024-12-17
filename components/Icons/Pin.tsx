"use client";

import { iconPropsInterface } from "@/interfaces";

const PinIcon: React.FC<iconPropsInterface> = ({
  className,
  onClick,
  fill = "#ababad",
}) => {
  return (
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
        d="M7.31731 12.6831C7.56139 12.9271 7.56139 13.3229 7.31731 13.5669L4.19231 16.6919C3.94823 16.936 3.5525 16.936 3.30842 16.6919C3.06435 16.4479 3.06435 16.0521 3.30842 15.8081L6.43342 12.6831C6.6775 12.439 7.07323 12.439 7.31731 12.6831Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0176 1.60578C12.1705 1.54176 12.3346 1.50879 12.5004 1.50879C12.6662 1.50879 12.8303 1.54176 12.9832 1.60578C13.1352 1.66943 13.2731 1.7625 13.389 1.87964L18.1207 6.61133C18.2378 6.72723 18.3309 6.86515 18.3945 7.01716C18.4586 7.17006 18.4915 7.33417 18.4915 7.49993C18.4915 7.6657 18.4586 7.8298 18.3945 7.9827C18.3309 8.13471 18.2378 8.27261 18.1207 8.3885L13.5547 12.9546C14.2846 14.944 13.1481 16.8154 12.5228 17.6419C12.4148 17.7853 12.2772 17.9038 12.1192 17.9893C11.961 18.0749 11.7862 18.1254 11.6067 18.1372C11.4273 18.1491 11.2473 18.1221 11.0792 18.0581C10.9121 17.9944 10.7607 17.8956 10.635 17.7684L2.21661 9.35002L2.21552 9.34894C2.09129 9.22548 1.9944 9.07729 1.93112 8.91397C1.86765 8.75017 1.83942 8.57484 1.84827 8.3994C1.85711 8.22396 1.90284 8.05235 1.98246 7.89577C2.06208 7.73919 2.1738 7.60115 2.31036 7.49064C3.60311 6.446 4.87914 6.21139 5.8437 6.25446C6.32049 6.27575 6.71552 6.36424 6.99486 6.44894C7.00722 6.45269 7.01936 6.45643 7.03128 6.46016L11.6117 1.87969C11.7277 1.76253 11.8656 1.66944 12.0176 1.60578ZM17.2381 7.49656L12.5004 2.7588L12.497 2.7622L7.62984 7.62937C7.44034 7.81887 7.15127 7.86637 6.91124 7.74787L6.90343 7.74423C6.8943 7.74006 6.87765 7.73267 6.85396 7.72299C6.8065 7.7036 6.73131 7.67523 6.63215 7.64516C6.43322 7.58484 6.14221 7.51903 5.78794 7.50322C5.09047 7.47207 4.12412 7.63223 3.09668 8.46234L3.09859 8.46424L11.5243 16.8899L11.5255 16.8884C12.1687 16.0384 12.9748 14.5276 12.2544 13.0929C12.1335 12.8521 12.1804 12.561 12.371 12.3705L17.2415 7.49992L17.2381 7.49656Z"
        fill={fill}
      />
    </svg>
  );
};

export default PinIcon;
