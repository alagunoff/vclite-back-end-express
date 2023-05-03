interface ValidatedPaginationQueryParameters {
  pageNumber?: string;
  itemsNumber?: string;
}

interface ValidationErrors {
  pageNumber?: string;
  itemsNumber?: string;
}

export type { ValidatedPaginationQueryParameters, ValidationErrors };
