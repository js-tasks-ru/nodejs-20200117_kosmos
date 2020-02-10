const Product = require("../models/Product");

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const products = await Product.find(
    {
      $text: {
        $search: ctx.request.query.query
      }
    },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

  ctx.body = { products };
};
