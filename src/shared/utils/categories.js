async function setSubcategories (category) {
  const subcategories = await category.getSubcategories()

  category.setDataValue('subcategories', subcategories)

  if (subcategories.length) {
    for (const subcategory of subcategories) {
      await setSubcategories(subcategory)
    }
  }
}

module.exports = { setSubcategories }
