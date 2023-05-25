import prisma from "src/prisma";

import { type CategoryWithSubcategories } from "./types";

async function includeSubcategories(category: CategoryWithSubcategories) {
  const subcategories = await prisma.category.findMany({
    where: {
      parentCategoryId: category.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (subcategories.length) {
    category.subcategories = subcategories;

    for (const subcategory of subcategories) {
      await includeSubcategories(subcategory);
    }
  }
}

export { includeSubcategories };
