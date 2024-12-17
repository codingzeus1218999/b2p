"use client";

import { SwitchProps } from "@/interfaces";
import classNames from "classnames";
import React from "react";
import styles from "./style.module.css";

const Switch: React.FC<SwitchProps> = ({ on, onChange }) => {
  return (
    <button
      className={classNames(styles.switch, on ? styles.on : styles.off)}
      onClick={() => onChange(!on)}
    >
      <span className={styles.pin} />
    </button>
  );
};

export default Switch;
