"use client";

import { ButtonWhiteProps } from "@/interfaces";
import classNames from "classnames";
import styles from "./style.module.css";

const ButtonWhite: React.FC<ButtonWhiteProps> = ({
  children,
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
      {children}
    </div>
  );
};

export default ButtonWhite;
