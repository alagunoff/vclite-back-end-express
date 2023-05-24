interface ValidationErrors {
  pageNumber?: string;
  itemsNumber?: string;
}

interface PaginationParameters {
  skip: number;
  take: number;
}

export type { ValidationErrors, PaginationParameters };
