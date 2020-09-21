const uuid = require("uuid/v4");
const User = require("../models/User");
const sendMail = require("../libs/sendMail");

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;

  const token = uuid();
  const user = await User.create({
    email,
    displayName,
    verificationToken: token,
  });

  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: "confirmation",
    locals: { token },
    to: email,
    subject: "Подтвердите почту",
  });

  ctx.body = { status: "ok" };
  ctx.status = 200;
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;

  if (!verificationToken) {
    ctx.body = { error: "Ссылка подтверждения недействительна или устарела" };
    ctx.status = 400;
    return;
  }

  const user = await User.findOne({ verificationToken });
  if (!user) {
    ctx.body = { error: "Ссылка подтверждения недействительна или устарела" };
    ctx.status = 400;
    return;
  }

  user.verificationToken = undefined;
  await user.save();

  const token = await ctx.login(user);
  ctx.body = { token };
};
