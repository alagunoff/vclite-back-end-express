function createPaginationParameters(
  pageNumber: any,
  itemsNumber: any
): { skip: number | undefined; take: number | undefined } {
  const pageNumberAsNumber = Number(pageNumber);
  const itemsNumberAsNumber = Number(itemsNumber);

  return {
    skip:
      pageNumberAsNumber && itemsNumberAsNumber
        ? (pageNumberAsNumber - 1) * itemsNumberAsNumber
        : undefined,
    take: itemsNumberAsNumber || undefined,
  };
}

export { createPaginationParameters };
