const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const socketToken = require("jwt-then");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser || !foundUser.active)
    return res.status(401).json({ message: "Unauthorized: banned." });
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match)
    return res.status(401).json({ message: "Unauthorized: wrong password." });
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        avatar: foundUser.avatar,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET
    // { expiresIn: '15m' }
  );

  const socketAccessToken = await socketToken.sign(
    {
      UserInfo: {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        avatar: foundUser.avatar,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET
    // { expiresIn: '7d' }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, socketAccessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: "Unauthorized: no cookies" });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,

    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();
      if (!foundUser)
        return res.status(401).json({ message: "Unauthorized: no user found" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser.id,
            username: foundUser.username,
            name: foundUser.name,
            avatar: foundUser.avatar,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
        // { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204).json({ message: "No Content" });

  res.clearCookie("jwt", { expiresIn: new Date(0) });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
