const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length)
    return res.status(400).json({ message: "BAD REQUEST : No users found" });

  res.status(200).json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  console.log("REQ FILE", req.file);
  const { name, username, password, roles } = req.body;

  if (!name || !username || !password || !Array.isArray(roles) || !roles.length)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "CONFLICT : This username already exists!" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = { name, username, password: hashedPassword, roles };
  const user = await User.create(userObject);
  if (user)
    res
      .status(201)
      .json({ message: `CREATED: User ${username} created successfully!` });
  else
    res
      .status(400)
      .json({ message: "BAD REQUEST : Invalid user data recieved" });
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, name, username, roles, password, active, avatar } = req.body;

  if (!id || !name || !username)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const user = await User.findById(id).exec();
  if (!user)
    return res.status(400).json({ message: "BAD REQUEST : User not found" });

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate username!" });

  user.username = username;
  user.roles = roles;
  user.active = active;
  user.name = name;
  user.avatar = user.avatar;

  if (password) user.password = await bcrypt.hash(password, 10);

  const updatedUser = await user.save();
  res
    .status(201)
    .json({ message: `${updatedUser.username} updated successfully!` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "BAD REQUEST : User id required" });

  const user = await User.findById(id).exec();
  if (!user)
    return res.status(400).json({ message: "BAD REQUEST : User not found" });

  const deletedUser = await user.deleteOne();
  const reply = `Username ${deletedUser.username} with ID ${deletedUser.id} deleted successfully!`;
  res.status(200).json(reply);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "namaagahi.co@gmail.com",
    pass: "rnjrvsfbygqhfvzn",
  },
});
// ("rnjr vsfb ygqh fvzn");

const sendEmailToUsers = asyncHandler(async (req, res) => {
  console.log("Received request to send emails");
  const { userIds, uuid } = req.body;
  try {
    for (const userId of userIds) {
      // Fetch user details based on userId
      const user = await User.findById(userId);

      if (!user) {
        // If user not found, skip sending email to this user
        console.log(
          `User with ID ${userId} not found. Skipping email sending.`
        );
        continue;
      }

      // Construct email content with RTL direction
      const emailContent = `
    <div dir="rtl">
      <p>با سلام،</p>
      <p>همکار گرامی،</p>
      <p>شما به پروپوزال جدیدی با کد ${uuid} اساین شده اید.</p>
      <p>از لینک زیر می‌توانید وارد حساب کاربری خود شده و بررسی لازم را انجام دهید:</p>
      <p><a href="http://portal.namaagahi.com">http://portal.namaagahi.com</a></p>
      <p>با تشکر</p>
    </div>
  `;

      // Send email
      const mailOptions = {
        from: "namaagahi.co@gmail.com",
        to: user.username, // Assuming the user's email is stored in the 'email' field
        subject: "Assign To New Proposal",
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.username}`);
    }

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  sendEmailToUsers,
};
