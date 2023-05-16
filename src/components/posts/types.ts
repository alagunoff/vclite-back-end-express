import { type ORDER_VALID_VALUES } from "./constants";

interface ValidatedCreationData {
  image: string;
  extraImages?: string[];
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  tagsIds: number[];
}

interface ValidatedUpdateData {
  image?: string;
  extraImages?: string[];
  title?: string;
  content?: string;
  categoryId?: number;
  tagsIds?: number[];
}

interface ValidationErrors {
  image?: string;
  extraImages?: string;
  title?: string;
  content?: string;
  authorId?: string;
  categoryId?: string;
  tagsIds?: string;
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

interface ValidatedOrderQueryParameters {
  orderBy?: (typeof ORDER_VALID_VALUES)[number];
}

interface OrderQueryParametersValidationErrors {
  orderBy?: string;
}

export type {
  ValidatedCreationData,
  ValidatedUpdateData,
  ValidationErrors,
  ValidatedFilterQueryParameters,
  FilterQueryParametersValidationErrors,
  ValidatedOrderQueryParameters,
  OrderQueryParametersValidationErrors,
};
