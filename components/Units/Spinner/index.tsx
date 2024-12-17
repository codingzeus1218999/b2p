"use client";

import { SpinnerProps } from "@/interfaces";
import classNames from "classnames";
import styles from "./style.module.css";

const Spinner: React.FC<SpinnerProps> = ({
  color = "blue",
  size = 36,
  innerColor,
  width = 4,
  blur = false,
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        color === "blue" ? styles.blue : color === "white" ? styles.white : ""
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        padding: `${width}px`,
      }}
    >
      <div className={styles.inner} style={{ backgroundColor: innerColor }}>
        {blur && <div className={styles.blurSection}></div>}
      </div>
      <div
        className={styles.pointer}
        style={{ width: `${width}px`, height: `${width}px` }}
      ></div>
    </div>
  );
};

export default Spinner;
