"use client";

import { ToggleTabProps } from "@/interfaces";
import classNames from "classnames";
import styles from "./style.module.css";

const ToggleTab: React.FC<ToggleTabProps> = ({ activeItem, list, onClick }) => {
  return (
    <div className={styles.container}>
      {list.map((l, _idx) => (
        <div
          key={_idx}
          className={classNames(
            styles.item,
            activeItem?.value === l.value ? styles.active : ""
          )}
          onClick={() => {
            if (activeItem?.value === l.value) return;
            onClick(l);
          }}
        >
          {l.label}
        </div>
      ))}
    </div>
  );
};

export default ToggleTab;
