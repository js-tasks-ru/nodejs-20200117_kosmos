const categoryMapper = rawCategory => {
  const result = {
    id: rawCategory.id,
    title: rawCategory.title
  };
  if (rawCategory.subcategories) {
    result.subcategories = rawCategory.subcategories.map(categoryMapper);
  }

  return result;
};

module.exports = categoryMapper;
