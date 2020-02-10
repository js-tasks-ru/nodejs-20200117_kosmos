const Product = require("../models/Product");
const productMapper = require("../mappers/product");

const mongoose = require("mongoose");

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const subcategoryQueryParam = ctx.query.subcategory;
  if (subcategoryQueryParam) {
    const productsBySubcategory = await Product.find({
      subcategory: subcategoryQueryParam
    });
    ctx.body = { products: productsBySubcategory.map(productMapper) };
    return;
  }

  return await next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = { products: products.map(productMapper) };
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, "invalid id");
  }

  const product = await Product.findById(ctx.params.id);

  if (product) {
    ctx.body = { product: productMapper(product) };
    return;
  } else {
    ctx.throw(404, "product not found");
  }
};
