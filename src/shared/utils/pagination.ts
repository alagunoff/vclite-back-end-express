function createPaginationParameters(queryParams: {
  pageNumber?: string;
  itemsNumber?: string;
  [k: string]: unknown;
}):
  | {
      skip: number;
      take: number;
    }
  | undefined {
  if ("pageNumber" in queryParams && "itemsNumber" in queryParams) {
    return {
      skip:
        (Number(queryParams.pageNumber) - 1) * Number(queryParams.itemsNumber),
      take: Number(queryParams.itemsNumber),
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
