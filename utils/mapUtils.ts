import {
  buyerCardInterface,
  buyerInterface,
  categoryInterface,
  deliveryTypeInterface,
  dropdownItemInterface,
  homeSliderInterface,
  homeSwiperItemInterface,
  instructionStepInterface,
  instructionsDataInterface,
  nestedDropdownItemInterface,
  reviewCardInterface,
  reviewInterface,
  sizeInterface,
  typeInterface,
} from "@/interfaces";
import moment from "moment";

export const mapCategoriesToNestedDropdownData = (
  data: categoryInterface[]
): nestedDropdownItemInterface[] => {
  const result: nestedDropdownItemInterface[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push({
      label: data[i].title,
      value: data[i].id,
      parentId: null,
      subValues: data[i].categories.map((c) => c.id),
    });
    for (let j = 0; j < data[i].categories.length; j++) {
      result.push({
        label: data[i].categories[j].title,
        value: data[i].categories[j].id,
        parentId: data[i].id,
        subValues: [],
      });
    }
  }
  return result;
};

export const mapTypesToDropdownData = (
  data: typeInterface[]
): dropdownItemInterface[] => {
  const result: dropdownItemInterface[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push({
      label: data[i].title,
      value: data[i].id,
    });
  }
  return result;
};

export const mapSizesToDropdownData = (
  data: sizeInterface[]
): dropdownItemInterface[] => {
  const result: dropdownItemInterface[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push({
      label: data[i].title,
      value: data[i].id,
    });
  }
  return result;
};

export const mapReviewsesToCardData = async (
  reviews: reviewInterface[]
): Promise<reviewCardInterface[]> => {
  const result: reviewCardInterface[] = [];
  for (let i = 0; i < reviews.length; i++) {
    // const p = reviews[i].product_id
    //   ? await fetchProductById(reviews[i].product_id)
    //   : null;
    result.push({
      rating: reviews[i].rating,
      date: moment(reviews[i].publish_at).format("DD.MM.YYYY"),
      time: moment(reviews[i].publish_at).format("HH:mm"),
      location: reviews[i].cities,
      nick: reviews[i].author,
      comment: reviews[i].comment,
      ProductName: "",
      // ProductName: p?.title ?? "",
      responderName: reviews[i].response.author,
      responseText: reviews[i].response.comment,
    });
  }
  return result;
};
export const mapHomeSlidersToSwiperData = (
  sliders: homeSliderInterface[]
): homeSwiperItemInterface[] => {
  return sliders
    .sort((a, b) =>
      a.sorting - b.sorting > 0 ? 1 : a.sorting - b.sorting < 0 ? -1 : 0
    )
    .map((t) => ({ imageSrc: t.path }));
};
export const mapBuyersToCardDta = (
  buyers: buyerInterface[]
): buyerCardInterface[] => {
  return buyers.map((b) => ({
    id: b.id,
    picture: b.picture.path,
    name: b.shop_name,
    comments: b.comments,
    isFavorites: b.is_favorites,
  }));
};
export const mapInstructionsData = (
  data: any
): instructionsDataInterface | null => {
  if (typeof data !== "object" || !data) {
    return null;
  }
  const platforms: { [key: string]: instructionStepInterface[] } = {};
  for (const platform in data.platforms) {
    if (data.platforms.hasOwnProperty(platform)) {
      const steps = data.platforms[platform];
      platforms[platform] = Object.keys(steps).map((key: string) => ({
        header: steps[key].header,
        image: steps[key].image,
        footer: steps[key].footer || "",
        qr_code: steps[key].qr_code || "",
      }));
    }
  }

  const instructionsData = {
    title: data.title,
    description: data.description,
    image: data.image,
    platforms: platforms,
  };

  return instructionsData;
};
export const mapDeliveryTypesToDropdownData = (
  data: deliveryTypeInterface[]
): dropdownItemInterface[] => {
  return data
    .sort((a, b) => a.sorting - b.sorting)
    .map((d) => ({
      label: d.title,
      value: d.id,
      // icon: "&#9995;",
      icon: d.icon,
    }));
};
export const findIcon = (
  data: dropdownItemInterface[],
  name: string
): string => {
  const item = data.filter((d) => d.label.toLowerCase() === name.toLowerCase());
  return item.length === 0 || !item[0].icon ? "" : item[0].icon;
};
