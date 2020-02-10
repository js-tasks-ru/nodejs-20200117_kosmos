const Koa = require("koa");
const app = new Koa();

const Chat = require("./chat");

app.use(require("koa-static")("public"));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

const chat = new Chat();

router.get("/subscribe", async (ctx, next) => {
  const message = await new Promise((resolve, reject) => {
    chat.subscribe(resolve);
  });
  ctx.body = message;
});

router.post("/publish", async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message || !message.trim()) {
    ctx.body = "";
    return;
  }
  chat.publish(message);
  ctx.body = "";
});

app.use(router.routes());

module.exports = app;
