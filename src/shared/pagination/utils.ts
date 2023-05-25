import { type PaginationParameters } from "./types";

function createPaginationParameters({
  pageNumber,
  itemsNumber,
}: {
  pageNumber?: string;
  itemsNumber?: string;
}): PaginationParameters {
  const result: PaginationParameters = {};

  if (pageNumber && itemsNumber) {
    const itemsNumberAsNumber = Number(itemsNumber);

    result.skip = (Number(pageNumber) - 1) * itemsNumberAsNumber;
    result.take = itemsNumberAsNumber;
  }

  return result;
}

function calculatePagesTotalNumber(
  itemsTotalNumber: number,
  itemsDesiredNumber?: number
) {
  return itemsTotalNumber && itemsDesiredNumber
    ? Math.ceil(itemsTotalNumber / itemsDesiredNumber)
    : 1;
}

export { createPaginationParameters, calculatePagesTotalNumber };
