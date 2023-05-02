interface CreationDataValidationErrors {
  image?: string;
  extraImages?: string;
  title?: string;
  content?: string;
  categoryId?: string;
  tagsIds?: string | Record<number, string>;
}

interface FilterQueryParametersValidationErrors {
  titleContains?: string;
  contentContains?: string;
  authorFirstName?: string;
  categoryId?: string;
  tagId?: string;
  tagIdIn?: string;
  tagIdAll?: string;
  createdAt?: string;
  createdAtLt?: string;
  createdAtGt?: string;
}

interface ValidatedFilterQueryParameters {
  titleContains?: string;
  contentContains?: string;
  authorFirstName?: string;
  categoryId?: string;
  tagId?: string;
  tagIdIn?: string[];
  tagIdAll?: string[];
  createdAt?: string;
  createdAtLt?: string;
  createdAtGt?: string;
}

interface OrderQueryParametersValidationErrors {
  orderBy?: string;
}

export type {
  CreationDataValidationErrors,
  FilterQueryParametersValidationErrors,
  ValidatedFilterQueryParameters,
  OrderQueryParametersValidationErrors,
};
