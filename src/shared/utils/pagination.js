function createPaginationParameters(itemsNumber, pageNumber) {
  const limit = Number(itemsNumber) || undefined;
  const pageNumberAsNumber = Number(pageNumber);

  return {
    limit,
    offset:
      limit && pageNumberAsNumber > 1
        ? limit * (pageNumberAsNumber - 1)
        : undefined,
  };
}

function createPaginatedResponse(rows, count, limit) {
  return {
    items: rows,
    totalItemsNumber: count,
    totalPagesNumber: count && limit ? Math.ceil(count / limit) : 1,
  };
}

module.exports = {
  createPaginationParameters,
  createPaginatedResponse,
};
