import prisma from "prisma";

interface CategoryWithSubcategories {
  id: number;
  category: string;
  subcategories?: CategoryWithSubcategories[];
}

async function includeSubcategories(
  category: CategoryWithSubcategories
): Promise<void> {
  const subcategories = await prisma.category.findMany({
    where: {
      parentCategoryId: category.id,
    },
    select: {
      id: true,
      category: true,
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
