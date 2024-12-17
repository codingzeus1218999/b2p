"use client";

import { iconPropsInterface } from "@/interfaces";

const ErrorIcon: React.FC<iconPropsInterface> = ({
  fill = "#ff6635",
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
        d="M10.0859 13.7487H11.9193V15.582H10.0859V13.7487ZM10.0859 6.41536H11.9193V11.9154H10.0859V6.41536ZM10.9934 1.83203C5.93344 1.83203 1.83594 5.9387 1.83594 10.9987C1.83594 16.0587 5.93344 20.1654 10.9934 20.1654C16.0626 20.1654 20.1693 16.0587 20.1693 10.9987C20.1693 5.9387 16.0626 1.83203 10.9934 1.83203ZM11.0026 18.332C6.95094 18.332 3.66927 15.0504 3.66927 10.9987C3.66927 6.94703 6.95094 3.66536 11.0026 3.66536C15.0543 3.66536 18.3359 6.94703 18.3359 10.9987C18.3359 15.0504 15.0543 18.332 11.0026 18.332Z"
        fill={fill}
      />
    </svg>
  );
};

export default ErrorIcon;
