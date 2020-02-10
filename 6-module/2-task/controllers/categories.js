const Category = require("../models/Category");

module.exports.categoryList = async function categoryList(ctx, next) {
  ctx.body = await Category.find();
};
