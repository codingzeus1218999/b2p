"use client";

import { ButtonMediumProps } from "@/interfaces";
import classNames from "classnames";
import styles from "./style.module.css";

const ButtonMedium: React.FC<ButtonMediumProps> = ({
  children,
  status = "active",
  onClick = () => {},
  style = "primary",
}) => {
  const onClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (status === "disable") return;
    onClick();
  };

  return (
    <button
      className={classNames(
        styles.container,
        status === "disable" ? styles.disable : styles.active,
        style === "primary"
          ? styles.primary
          : style === "secondary"
          ? styles.secondary
          : ""
      )}
      onClick={onClickButton}
    >
      {children}
    </button>
  );
};

export default ButtonMedium;
