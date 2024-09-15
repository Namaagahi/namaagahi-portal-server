const FinalCustomer = require("../model/FinalCustomer");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

// @desc Get all finalCustomers
// @route GET /finalCustomers
// @access Private
const getAllFinalCustomers = asyncHandler(async (req, res) => {
  const finalCustomers = await FinalCustomer.find().lean();
  if (!finalCustomers?.length)
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST : No finalCustomers found",
    });

  const finalCustomersWithUser = await Promise.all(
    finalCustomers.map(async (finalCustomer) => {
      const user = await User.findById(finalCustomer.userId).lean().exec();
      return { ...finalCustomer, username: user.username };
    })
  );

  res.json(finalCustomersWithUser);
});

// @desc Create new finalCustomer
// @route POST /finalCustomers
// @access Private
const createNewFinalCustomer = asyncHandler(async (req, res) => {
  const {
    userId,
    finalCustomerId,
    name,
    contractType,
    customerType,
    agent,
    nationalId,
    ecoCode,
    regNum,
    address,
    postalCode,
    phone,
    planId,
  } = req.body;

  if (!userId || !finalCustomerId || !name)
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST : company name is required",
    });

  const duplicate = await FinalCustomer.findOne({ nationalId }).lean().exec();
  if (nationalId) {
    if (duplicate)
      return res.status(409).json({
        success: false,
        message: "CONFLICT :Duplicate finalCustomer nationalId",
      });
  }

  const finalCustomer = await FinalCustomer.create({
    userId,
    finalCustomerId,
    name,
    contractType,
    customerType,
    agent,
    nationalId: contractType === "official" ? nationalId : null,
    ecoCode,
    regNum,
    address,
    postalCode,
    phone,
    planIds: planId ? [planId] : [],
  });

  if (finalCustomer)
    return res.status(201).json({
      success: true,
      message: `CREATED: FinalCustomer ${req.body.name} created successfully!`,
    });
  else
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST : Invalid finalCustomer data received",
    });
});

// @desc Update a finalCustomer
// @route PATCH /finalCustomers
// @access Private
const updateFinalCustomer = asyncHandler(async (req, res) => {
  const {
    id,
    userId,
    finalCustomerId,
    name,
    contractType,
    customerType,
    agent,
    nationalId,
    ecoCode,
    regNum,
    address,
    postalCode,
    phone,
    planId,
    planIds,
  } = req.body;

  if (!userId || !finalCustomerId || !name || !nationalId)
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST : company name and nationalId are required",
    });

  const finalCustomer = await FinalCustomer.findById(id);

  if (!finalCustomer)
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST : FinalCustomer not found",
    });
  if (planId && !finalCustomer.planIds.includes(planId))
    finalCustomer.planIds.push(planId);

  finalCustomer.userId = userId;
  finalCustomer.finalCustomerId = finalCustomerId;
  finalCustomer.name = name;
  finalCustomer.contractType = contractType;
  finalCustomer.customerType = customerType;
  finalCustomer.agent = agent;
  finalCustomer.nationalId = nationalId;
  finalCustomer.ecoCode = ecoCode;
  finalCustomer.regNum = regNum;
  finalCustomer.address = address;
  finalCustomer.postalCode = postalCode;
  finalCustomer.phone = phone;
  finalCustomer.planIds = planIds;

  const duplicate = await FinalCustomer.findOne({ nationalId }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({
      success: false,
      message: "CONFLICT :Duplicate finalCustomer nationalId",
    });

  await finalCustomer.save();

  res.status(200).json({
    success: true,
    message: `UPDATED: Final customer ${finalCustomer.name} updated successfully!`,
  });
});

// @desc Delete a finalCustomer
// @route DELETE /finalCustomers
// @access Private
const deleteFinalCustomer = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res.status(400).json({
      success: false,
      message: "FinalCustomer ID required",
    });

  const finalCustomer = await FinalCustomer.findByIdAndDelete(id);

  if (!finalCustomer)
    return res.status(400).json({
      success: false,
      message: "FinalCustomer not found",
    });

  res.status(200).json({
    success: true,
    message: `DELETED: Final customer ${finalCustomer.name} deleted successfully!`,
  });
});

module.exports = {
  getAllFinalCustomers,
  updateFinalCustomer,
  createNewFinalCustomer,
  deleteFinalCustomer,
};
