"use client";

import { LOCALSTORAGES } from "@/constants";
import { StoryCardProps } from "@/interfaces";
import { saveDataInLocalStorage } from "@/utils/calcUtils";
import { useRouter } from "next/router";
import Skeleton from "../Skeleton";
import styles from "./style.module.css";

const StoryCard: React.FC<StoryCardProps> = ({ isLoading, story }) => {
  const router = useRouter();
  return (
    <div
      className={styles.container}
      onClick={() => {
        saveDataInLocalStorage(LOCALSTORAGES.START_STORY, story?.id ?? null);
        router.push("/stories");
      }}
    >
      <div className={styles.content}>
        {isLoading ? (
          <Skeleton className="rounded-lg w-full h-full" />
        ) : (
          <img
            width={78}
            height={78}
            className="rounded-[10px] object-cover object-center"
            src={story?.file.path ?? "/images/no_img.png"}
            alt={story?.file.filename ?? ""}
          />
        )}
        <p className={styles.title}>{story?.title ?? ""}</p>
      </div>
    </div>
  );
};

export default StoryCard;
