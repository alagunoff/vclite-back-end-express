function isNotEmptyString(value: unknown): boolean {
  return typeof value === "string" && value !== "";
}

export { isNotEmptyString };
