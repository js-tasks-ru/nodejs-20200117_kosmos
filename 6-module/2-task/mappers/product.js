const productMapper = productRaw => {
  return {
    id: productRaw._id,
    title: productRaw.title,
    images: productRaw.images,
    category: productRaw.category,
    subcategory: productRaw.subcategory,
    price: productRaw.price,
    description: productRaw.description
  };
};

module.exports = productMapper;
