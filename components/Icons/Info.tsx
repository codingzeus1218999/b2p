"use client";

import { iconPropsInterface } from "@/interfaces";

const InfoIcon: React.FC<iconPropsInterface> = ({
  fill = "#0288d1",
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
        d="M10.0859 6.41536H11.9193V8.2487H10.0859V6.41536ZM10.0859 10.082H11.9193V15.582H10.0859V10.082ZM11.0026 1.83203C5.9426 1.83203 1.83594 5.9387 1.83594 10.9987C1.83594 16.0587 5.9426 20.1654 11.0026 20.1654C16.0626 20.1654 20.1693 16.0587 20.1693 10.9987C20.1693 5.9387 16.0626 1.83203 11.0026 1.83203ZM11.0026 18.332C6.9601 18.332 3.66927 15.0412 3.66927 10.9987C3.66927 6.9562 6.9601 3.66536 11.0026 3.66536C15.0451 3.66536 18.3359 6.9562 18.3359 10.9987C18.3359 15.0412 15.0451 18.332 11.0026 18.332Z"
        fill={fill}
      />
    </svg>
  );
};

export default InfoIcon;
