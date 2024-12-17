"use client";

import classNames from "classnames";
import React from "react";
import styles from "./style.module.css";

type SkeletonProps = {
  className: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={classNames(className, styles.skeleton)}></div>;
};

export default Skeleton;
