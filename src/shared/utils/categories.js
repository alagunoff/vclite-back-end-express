async function addSubcategories(category) {
  const subcategories = await category.getSubcategories();

  category.setDataValue("subcategories", subcategories);

  if (subcategories.length) {
    for (const subcategory of subcategories) {
      await addSubcategories(subcategory);
    }
  }
}

module.exports = { addSubcategories };
