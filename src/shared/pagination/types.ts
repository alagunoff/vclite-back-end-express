interface ValidatedPaginationQueryParameters {
  pageNumber?: string;
  itemsNumber?: string;
}

interface PaginationQueryParametersValidationErrors {
  pageNumber?: string;
  itemsNumber?: string;
}

export type {
  ValidatedPaginationQueryParameters,
  PaginationQueryParametersValidationErrors,
};
