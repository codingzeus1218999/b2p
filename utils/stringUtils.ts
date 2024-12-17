export const removeHtmlTags = (str?: string): string => {
  return str ? str.replace(/<[^>]+>/g, "") : "";
};
