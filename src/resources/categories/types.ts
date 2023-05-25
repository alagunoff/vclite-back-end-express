interface ValidationErrors {
  name?: string;
  parentCategoryId?: string;
}

interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories?: CategoryWithSubcategories[];
}

export type { ValidationErrors, CategoryWithSubcategories };
