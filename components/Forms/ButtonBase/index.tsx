"use client";

import { ButtonBaseProps } from "@/interfaces";
import classNames from "classnames";
import styles from "./style.module.css";

const ButtonBase: React.FC<ButtonBaseProps> = ({
  children,
  status = "active",
  onClick = () => {},
  type = "button",
  style = "primary",
}) => {
  const onClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (status === "disable") return;
    onClick();
  };

  return (
    <button
      type={type ?? "button"}
      className={classNames(
        styles.container,
        status === "disable" ? styles.disable : styles.active,
        style === "primary"
          ? styles.primary
          : style === "secondary"
          ? styles.secondary
          : style === "red"
          ? styles.red
          : ""
      )}
      onClick={onClickButton}
    >
      {children}
    </button>
  );
};

export default ButtonBase;
