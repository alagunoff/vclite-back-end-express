import { type Category } from "@prisma/client";

interface CategoryWithSubcategories {
  id: Category["id"];
  category: Category["category"];
  subcategories?: Array<Omit<Category, "parentCategoryId">>;
}

export type { CategoryWithSubcategories };
