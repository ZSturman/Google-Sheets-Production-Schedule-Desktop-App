export const useCellStatusToGetClassName = (
  status: "default" | "error" | "needsAttention" | string,
  styles?: UiStyles
): string => {
    let className: string = "p-1";
    if (status === "error") {
        className += " bg-red-200";
    }
    if (status === "needsAttention") {
        className += " bg-yellow-200";
    }
    if (styles !== undefined) {
        //console.log("Need to implement styles");
        return className;
    }
    return className;
};
