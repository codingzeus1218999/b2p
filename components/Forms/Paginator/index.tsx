"use client";

import { PaginatorProps } from "@/interfaces";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

const Paginator: React.FC<PaginatorProps> = ({
  pageNumber,
  pageCount,
  onClickPage,
}) => {
  const [showableCount, setShowableCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    calcShowableCount();
    window.addEventListener("resize", calcShowableCount);
    return () => {
      window.removeEventListener("resize", calcShowableCount);
    };
  }, [containerRef.current]);

  useEffect(() => {
    getPagesToDisplay();
  }, [showableCount]);

  const calcShowableCount = () => {
    if (!containerRef.current) return;
    const numberContainerWidth =
      window.innerWidth > 1023
        ? containerRef.current.clientWidth - 152
        : containerRef.current.clientWidth - 128;
    setShowableCount(Math.floor(numberContainerWidth / 40));
  };

  const getPagesToDisplay = () => {
    const pages = [];
    const half = Math.floor((showableCount - 3) / 2); // Adjust to include first and last page
    let start = Math.max(pageNumber - half, 2);
    let end = Math.min(pageNumber + half, pageCount - 1);

    if (pageNumber - 1 <= half) {
      start = 2;
      end = Math.min(showableCount - 2, pageCount - 1);
    } else if (pageCount - pageNumber <= half) {
      start = Math.max(pageCount - showableCount + 3, 2);
      end = pageCount - 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pagesToDisplay = getPagesToDisplay();

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={classNames(
          styles.item,
          styles.arrow,
          pageNumber === 1 ? styles.disabled : ""
        )}
        onClick={() => {
          if (pageNumber === 1) return;
          onClickPage(pageNumber - 1);
        }}
      >
        <span>{"<"}</span>
      </div>
      <div className={styles.numberContainer}>
        <div
          className={classNames(
            styles.item,
            pageNumber === 1 ? styles.active : ""
          )}
          onClick={() => onClickPage(1)}
        >
          <span>1</span>
        </div>
        {pagesToDisplay.map((num) => (
          <div
            className={classNames(
              styles.item,
              pageNumber === num ? styles.active : ""
            )}
            onClick={() => onClickPage(num)}
            key={num}
          >
            <span>{num}</span>
          </div>
        ))}
        {pageCount > 1 && (
          <div
            className={classNames(
              styles.item,
              pageNumber === pageCount ? styles.active : ""
            )}
            onClick={() => onClickPage(pageCount)}
          >
            <span>{pageCount}</span>
          </div>
        )}
      </div>
      <div
        className={classNames(
          styles.item,
          styles.arrow,
          pageNumber === pageCount ? styles.disabled : ""
        )}
        onClick={() => {
          if (pageNumber === pageCount) return;
          onClickPage(pageNumber + 1);
        }}
      >
        <span>{">"}</span>
      </div>
    </div>
  );
};

export default Paginator;
