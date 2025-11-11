export const toDBTime = (date: Date | null) => {
  if (!date) return "N/A";
  const adjusted = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  return adjusted.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
