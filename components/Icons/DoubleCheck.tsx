"use client";

import { iconPropsInterface } from "@/interfaces";

const DoubleCheckIcon: React.FC<iconPropsInterface> = ({
  fill = "white",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
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
        d="M22.7439 5.43558C23.0556 5.70834 23.0872 6.18216 22.8144 6.49389L12.3144 18.4939C12.1777 18.6501 11.9824 18.7427 11.775 18.7496C11.5675 18.7565 11.3664 18.6771 11.2197 18.5303L6.71967 14.0303C6.42678 13.7374 6.42678 13.2626 6.71967 12.9697C7.01256 12.6768 7.48744 12.6768 7.78033 12.9697L11.7135 16.9028L21.6856 5.50613C21.9583 5.1944 22.4322 5.16282 22.7439 5.43558Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.21967 12.9697C2.51256 12.6768 2.98744 12.6768 3.28033 12.9697L7.78033 17.4697C8.07322 17.7626 8.07322 18.2374 7.78033 18.5303C7.48744 18.8232 7.01256 18.8232 6.71967 18.5303L2.21967 14.0303C1.92678 13.7374 1.92678 13.2626 2.21967 12.9697Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.2429 5.43468C18.5551 5.70688 18.5875 6.18064 18.3153 6.49286L11.9403 13.8054C11.6681 14.1176 11.1944 14.15 10.8821 13.8778C10.5699 13.6056 10.5375 13.1319 10.8097 12.8197L17.1847 5.50716C17.4569 5.19494 17.9306 5.16249 18.2429 5.43468Z"
        fill={fill}
      />
    </svg>
  );
};

export default DoubleCheckIcon;
