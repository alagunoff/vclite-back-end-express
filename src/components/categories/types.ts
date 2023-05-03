interface ValidatedCreationData {
  name: string;
  parentCategoryId?: number;
}

interface ValidatedUpdateData {
  name?: string;
  parentCategoryId?: number | null;
}

interface ValidationErrors {
  name?: string;
  parentCategoryId?: string;
}

interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories?: CategoryWithSubcategories[];
}

export type {
  ValidatedCreationData,
  ValidatedUpdateData,
  ValidationErrors,
  CategoryWithSubcategories,
};
