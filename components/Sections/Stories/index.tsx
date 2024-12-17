"use client";

import { StoryCard } from "@/components/Units";
import { storyInterface } from "@/interfaces";
import { fetchStories } from "@/services/storiesApi";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Stories: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<storyInterface[]>([]);

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await fetchStories(100, 1);
      setStories(data.data);
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Swiper
      spaceBetween={8}
      slidesPerView={"auto"}
      modules={[FreeMode]}
      freeMode
      slidesOffsetAfter={16}
      slidesOffsetBefore={16}
    >
      {isLoading
        ? Array.from({ length: 6 })
            .fill(0)
            .map((b, _idx) => (
              <SwiperSlide key={_idx} className="!w-fit">
                <StoryCard isLoading={true} />
              </SwiperSlide>
            ))
        : stories.map((story, _idx) => (
            <SwiperSlide key={_idx} className="!w-fit">
              <StoryCard story={story} />
            </SwiperSlide>
          ))}
    </Swiper>
  );
};

export default Stories;
