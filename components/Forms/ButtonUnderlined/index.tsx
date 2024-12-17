"use client";

import { ButtonUnderlinedProps } from "@/interfaces";
import classNames from "classnames";
import styles from "./style.module.css";

const ButtonUnderlined: React.FC<ButtonUnderlinedProps> = ({
  title = "",
  status = "active",
  onClick = () => {},
}) => {
  const onClickButton = () => {
    if (status === "disable") return;
    onClick();
  };

  return (
    <div
      className={classNames(
        styles.container,
        status === "disable" ? styles.disable : styles.active
      )}
      onClick={onClickButton}
    >
      <div className="flex flex-col items-center justify-center w-fit mx-auto">
        <span>{title}</span>
        <div className="mt-2px h-px border-t border-dashed border-indigo-80 w-full"></div>
      </div>
    </div>
  );
};

export default ButtonUnderlined;
