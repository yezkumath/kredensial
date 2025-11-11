// export const getBreadcrumbSegments = (pathname: string) => {
//     // Remove leading/trailing slashes and split into segments
//     const segments = pathname.split("/").filter(Boolean);

//     // Format segments into breadcrumb items
//     return segments.map((segment, index) => ({
//         name: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize first letter
//         href: "/" + segments.slice(0, index + 1).join("/"), // Build href dynamically
//         disabled: segment === "overview", // Disable the "Overview" segment
//     }));
// };

export const getBreadcrumbSegments = (pathname: string) => {
  // Remove leading/trailing slashes and split into segments
  const segments = pathname.split("/").filter(Boolean);

  // Format segments into breadcrumb items
  return segments.map((segment, index) => ({
    name: segment
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "),
    href: "/" + segments.slice(0, index + 1).join("/"), // Build href dynamically
    disabled: segment === "overview", // Disable the "Overview" segment
  }));
};
