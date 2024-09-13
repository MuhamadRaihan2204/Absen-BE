const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const User = require("../../models/user");
const sequelize = require("../../config/db");
const redisClient = require("../../config/redisClient");

exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne(
      { where: { email } },
      { transaction }
    );

    const existingUsername = await User.findOne(
      { where: { username } },
      { transaction }
    );

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ error: "Email already in use" });
    }

    if (existingUsername) {
      await transaction.rollback();
      return res.status(400).json({ error: "Username already in use" });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await User.create(
      {
        username,
        email,
        password: hashedPassword,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const existingToken = await redisClient.get(`user:${user._id}:token`);

    if (existingToken) {
      return res.status(200).json({ token: existingToken });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    redisClient.set(`user:${user.id}:token`, token, "EX", 24 * 60 * 60);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
