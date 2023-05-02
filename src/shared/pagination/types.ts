interface PaginationQueryParametersValidationErrors {
  pageNumber?: string;
  itemsNumber?: string;
}

interface ValidatedPaginationQueryParameters {
  pageNumber?: string;
  itemsNumber?: string;
}

export type {
  PaginationQueryParametersValidationErrors,
  ValidatedPaginationQueryParameters,
};
