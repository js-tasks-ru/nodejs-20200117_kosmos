const Order = require("../models/Order");
const sendMail = require("../libs/sendMail");

module.exports.checkout = async function checkout(ctx, next) {
  let order = await Order.create({
    ...ctx.request.body,
    user: ctx.user,
  });

  order = await order.populate("product").execPopulate();

  await sendMail({
    template: "order-confirmation",
    locals: { id: order.id, product: order.product },
    to: ctx.user.email,
    subject: "Новый заказ",
  });

  ctx.body = { order: order.id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({ user: ctx.user });

  ctx.status = 200;
  ctx.body = { orders };
};
