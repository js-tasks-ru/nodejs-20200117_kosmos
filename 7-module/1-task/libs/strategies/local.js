const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User");

module.exports = new LocalStrategy(
  { session: false, usernameField: "email" },
  async function(email, password, done) {
    const user = await User.findOne({ email });

    if (user) {
      if (await user.checkPassword(password)) {
        done(null, user);
      } else {
        done(null, false, "Неверный пароль");
      }
    } else {
      done(null, false, "Нет такого пользователя");
    }

    //done(null, false, "Стратегия подключена, но еще не настроена");
  }
);
