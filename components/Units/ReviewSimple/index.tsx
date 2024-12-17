"use client";

import { RatingSelector } from "@/components/Forms";
import { ReviewSimpleProps } from "@/interfaces";
import React from "react";

const ReviewSimple: React.FC<ReviewSimpleProps> = ({ review }) => {
  return (
    <div className="lg:flex flex-col p-3 bg-white rounded-lg shadow-[0_4px_24px_0px_rgba(25,118,210,0.16)] hidden">
      <div className="flex justify-between">
        <span className="justify-center text-xs font-medium leading-5 whitespace-nowrap text-zinc-900">
          {review.location}
        </span>
        <time className="flex am-gapX-4px self-start text-xs font-medium leading-5 whitespace-nowrap text-zinc-900">
          <span>{review.date}</span>
          <span>/</span>
          <span>{review.time}</span>
        </time>
      </div>
      <div className="h-3.5 w-28 lg:flex am-gapX-4px lg:h-fit mt-1 items-center">
        <RatingSelector
          value={review.rating}
          size={16}
          gap={4}
          displayOnlyValue
          valueGap={4}
          readOnly
        />
      </div>
      <p className="justify-center mt-2 text-sm font-light leading-[18px] text-zinc-900 max-md:max-w-full line-clamp-2">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewSimple;
