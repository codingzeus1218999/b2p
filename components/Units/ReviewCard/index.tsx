"use client";

import { RatingSelector } from "@/components/Forms";
import { ReviewCardProps } from "@/interfaces";
import React from "react";
import Skeleton from "../Skeleton";

const ReviewCard: React.FC<ReviewCardProps> = ({
  isLoading = false,
  review,
}) => {
  return (
    <div
      className={`flex flex-col p-3 bg-white rounded-lg shadow-custom-1 ${
        isLoading ? "am-gapY-1px" : ""
      }`}
    >
      {isLoading ? (
        <Skeleton className="rounded-md w-28 h-4" />
      ) : (
        <RatingSelector
          value={review?.rating ?? 0}
          readOnly={true}
          gap={4}
          size={16}
          displayOnlyValue
          valueGap={4}
        />
      )}
      {isLoading ? (
        <Skeleton className="rounded-md w-28 h-5" />
      ) : (
        <div className="text-xs leading-5 font-medium">
          {review?.location ?? ""}
        </div>
      )}
      {isLoading ? (
        <Skeleton className="rounded-md w-28 h-5" />
      ) : (
        <div className="text-xs leading-5">{review?.ProductName ?? ""}</div>
      )}
      <div className="my-2 flex justify-between">
        {isLoading ? (
          <Skeleton className="w-28 h-5 rounded-md" />
        ) : (
          <span className="text-xs leading-5 font-medium">
            {review?.nick ?? ""}
          </span>
        )}
        {isLoading ? (
          <Skeleton className="w-28 h-5 rounded-md" />
        ) : (
          <span className="text-xs leading-5 font-medium">
            <time className="flex am-gapX-4px self-start text-xs leading-5 whitespace-nowrap">
              <span>{review?.date ?? ""}</span>
              <span className="text-neutral-400">/</span>
              <span>{review?.time ?? ""}</span>
            </time>
          </span>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-6 rounded-md" />
      ) : (
        <span className="text-sm leading-22px font-light">
          {review?.comment ?? ""}
        </span>
      )}
      {isLoading ? (
        <Skeleton className="w-full h-6 rounded-md mt-2" />
      ) : (
        review?.responderName &&
        review?.responseText && (
          <div className="mt-2 p-3 bg-gray-100 rounded-xl">
            <div className="text-xs leading-5 lg:text-sm font-semibold mb-2">
              {review?.responderName ?? ""}
            </div>
            <div className="text-xs leading-5 lg:text-sm">
              {review?.responseText ?? ""}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ReviewCard;
