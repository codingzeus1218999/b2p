import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "@/components/Icons";
import { ToastProps } from "@/interfaces";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const calcWidth = () => {
        setWidth(
          window.innerWidth > 1023
            ? Math.min(1088, window.innerWidth)
            : window.innerWidth - 32
        );
      };

      calcWidth();
      window.addEventListener("resize", calcWidth);
      return () => {
        window.removeEventListener("resize", calcWidth);
      };
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "12px",
        width: `${width}px`,
        left: `calc(50vw - ${width / 2 + (width === 1088 ? 2 : 0)}px)`,
        zIndex: 9999,
      }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={classNames(
            styles.container,
            "am-gapX-12px",
            "animate-slideInDown",
            toast.type === "warning"
              ? styles.warning
              : toast.type === "success"
              ? styles.success
              : toast.type === "error"
              ? styles.error
              : toast.type === "info"
              ? styles.info
              : ""
          )}
          style={{
            width: `100%`,
            marginBottom: "10px",
          }}
          onClick={() => onClose(toast.id)}
        >
          {toast.type === "warning" && <WarningIcon className="min-w-22px" />}
          {toast.type === "success" && <SuccessIcon className="min-w-22px" />}
          {toast.type === "error" && <ErrorIcon className="min-w-22px" />}
          {toast.type === "info" && <InfoIcon className="min-w-22px" />}
          <p className="text-sm lg:leading-7 leading-none">{toast.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Toast;
