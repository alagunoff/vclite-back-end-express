function createPaginationParameters(queryParameters: {
  pageNumber?: string;
  itemsNumber?: string;
  [k: string]: unknown;
}):
  | {
      skip: number;
      take: number;
    }
  | undefined {
  if ("pageNumber" in queryParameters && "itemsNumber" in queryParameters) {
    return {
      skip:
        (Number(queryParameters.pageNumber) - 1) *
        Number(queryParameters.itemsNumber),
      take: Number(queryParameters.itemsNumber),
    };
  }
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
