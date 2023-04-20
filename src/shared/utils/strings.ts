function transformStringToLowercasedKebabString(string: string): string {
  return string
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-");
}

export { transformStringToLowercasedKebabString };
