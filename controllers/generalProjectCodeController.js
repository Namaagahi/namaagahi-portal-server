const GeneralProjectCode = require("../model/generalProjectCode");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

// @desc Get all generalProjectCodes
// @route GET /generalProjectCodes
// @access Private
const getAllGeneralProjectCodes = asyncHandler(async (req, res) => {
  const generalProjectCodes = await GeneralProjectCode.find().lean();
  if (!generalProjectCodes?.length) {
    return res
      .status(400)
      .json({ message: "BAD REQUEST: No general project codes found" });
  }

  const generalProjectCodesWithUser = await Promise.all(
    generalProjectCodes.map(async (generalProjectCode) => {
      const user = await User.findById(generalProjectCode.userId).lean().exec();
      return { ...generalProjectCode, username: user.username };
    })
  );

  res.json(generalProjectCodesWithUser);
});

// @desc Create new generalProjectCode
// @route POST /generalProjectCodes
// @access Private
const createNewGeneralProjectCode = asyncHandler(async (req, res) => {
  const { userId, year, identityCode } = req.body;

  try {
    const generalProjectCode = new GeneralProjectCode({
      userId,
      year,
      identityCode,
    });

    await generalProjectCode.save();

    res.status(201).json({
      message: "General project code created successfully",
      generalProjectCode,
    });
  } catch (error) {
    res.status(400).json({
      message:
        error.message || "BAD REQUEST: Unable to create general project code",
      error: error.message,
    });
  }
});

// @desc Update a generalProjectCode
// @route PATCH /generalProjectCodes
// @access Private
const updateGeneralProjectCode = asyncHandler(async (req, res) => {
  const { id, userId, year, identityCode } = req.body;

  if (!userId || !identityCode || !year) {
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST: All fields are required",
    });
  }

  const generalProjectCode = await GeneralProjectCode.findById(id);

  if (!generalProjectCode) {
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST: General project code not found",
    });
  }

  const duplicate = await GeneralProjectCode.findOne({ identityCode })
    .lean()
    .exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({
      success: false,
      message: "CONFLICT: Duplicate identity code",
    });
  }

  generalProjectCode.userId = userId;
  generalProjectCode.year = year;
  generalProjectCode.identityCode = identityCode;

  await generalProjectCode.save();

  res.status(200).json({
    success: true,
    message: `UPDATED: General project code ${generalProjectCode.identityCode} updated successfully!`,
  });
});

// @desc Delete a generalProjectCode
// @route DELETE /generalProjectCodes
// @access Private
const deleteGeneralProjectCode = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res
      .status(400)
      .json({ message: "General project code ID required" });

  const generalProjectCode = await GeneralProjectCode.findById(id).exec();
  if (!generalProjectCode) {
    return res.status(400).json({ message: "General project code not found" });
  }

  const result = await generalProjectCode.deleteOne();
  const reply = `General project code '${result.identityCode}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllGeneralProjectCodes,
  createNewGeneralProjectCode,
  updateGeneralProjectCode,
  deleteGeneralProjectCode,
};
