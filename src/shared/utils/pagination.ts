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

function calculatePagesTotalNumber(
  itemsTotalNumber: number,
  filteredItemsTotalNumber: number
): number {
  return itemsTotalNumber && filteredItemsTotalNumber
    ? Math.ceil(itemsTotalNumber / filteredItemsTotalNumber)
    : 1;
}

export { createPaginationParameters, calculatePagesTotalNumber };
