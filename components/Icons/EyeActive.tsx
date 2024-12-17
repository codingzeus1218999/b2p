"use client";

import { iconPropsInterface } from "@/interfaces";

const EyeActiveIcon: React.FC<iconPropsInterface> = ({
  fill = "#1976d2",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
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
        d="M12.4469 2.14275C12.6421 1.95242 12.9478 1.95242 13.1364 2.14275C13.3316 2.33309 13.3316 2.64813 13.1364 2.83847L11.9525 4.03301C12.8957 4.89938 13.6959 6.06766 14.2943 7.47223C14.3463 7.59693 14.3463 7.74133 14.2943 7.85947C12.9023 11.128 10.4239 13.0839 7.66579 13.0839H7.65928C6.40383 13.0839 5.20042 12.6704 4.14012 11.9156L2.87817 13.1889C2.78059 13.2874 2.657 13.3333 2.53341 13.3333C2.40981 13.3333 2.27971 13.2874 2.18864 13.1889C2.02602 13.0249 2 12.7623 2.1301 12.572L2.14961 12.5457L11.7704 2.83847C11.7834 2.82535 11.7964 2.81222 11.8029 2.79909C11.8159 2.78597 11.8289 2.77284 11.8354 2.75971L12.4469 2.14275ZM7.66754 2.25689C8.59775 2.25689 9.50193 2.48005 10.3346 2.9001L8.16192 5.09228C8.0058 5.06602 7.83667 5.04633 7.66754 5.04633C6.22996 5.04633 5.06558 6.22118 5.06558 7.67169C5.06558 7.84234 5.08509 8.01298 5.11111 8.17051L2.70429 10.599C2.0538 9.83761 1.48787 8.91873 1.03903 7.86203C0.98699 7.74389 0.98699 7.59949 1.03903 7.47479C2.43108 4.20622 4.90946 2.25689 7.66104 2.25689H7.66754ZM9.81241 6.19237L9.10338 6.90777C9.22047 7.13093 9.28551 7.39347 9.28551 7.66913C9.28551 8.56831 8.55696 9.30341 7.66579 9.30341C7.39258 9.30341 7.13238 9.23778 6.91122 9.11964L6.20218 9.83505C6.6185 10.1173 7.12588 10.2879 7.66579 10.2879C9.09687 10.2879 10.2613 9.11307 10.2613 7.66913C10.2613 7.12437 10.0921 6.61242 9.81241 6.19237Z"
        fill={fill}
      />
    </svg>
  );
};

export default EyeActiveIcon;
