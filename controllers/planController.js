const Plan = require("../model/Plan");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Structure = require("../model/Structure");

// @desc Get all plans
// @route GET /plans
// @access Private
const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find().lean();
  if (!plans?.length)
    return res.status(400).json({ message: "BAD REQUEST : No plans found" });

  const plansWithUser = await Promise.all(
    plans.map(async (plan) => {
      const user = await User.findById(plan.userId).lean().exec();
      return { ...plan, username: user.username };
    })
  );

  res.json(plansWithUser);
});

// @desc Create new plan
// @route POST /plans
// @access Private
const createNewPlan = asyncHandler(async (req, res) => {
  const {
    planId,
    mark,
    userId,
    initialCustomerId,
    finalCustomerId,
    projectCodeId,
    proposalCode,
    generalProjectCode,
    userDefinedMonthlyFeeWithDiscount,
    brand,
    type,
    structures,
    totalPackagePrice,
  } = req.body;

  console.log(structures);

  if (!userId || !initialCustomerId || !brand || !structures || !type)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const duplicate = await Plan.findOne({ planId }).lean().exec();
  if (duplicate)
    return res.status(409).json({ message: "CONFLICT :Duplicate plan id" });

  const plan = await Plan.create({
    planId,
    userId,
    mark,
    initialCustomerId,
    finalCustomerId,
    projectCodeId,
    proposalCode,
    generalProjectCode,
    userDefinedMonthlyFeeWithDiscount,
    brand,
    type,
    structures,
    totalPackagePrice,
  });
  if (plan)
    return res.status(201).json({
      message: `CREATED: Plan ${req.body.planId} created successfully!`,
    });
  else
    return res
      .status(400)
      .json({ message: "BAD REQUEST : Invalid plan data received" });
});

// @desc Update a plan
// @route PATCH /planes
// @access Private
const updatePlan = asyncHandler(async (req, res) => {
  const {
    id,
    planId,
    mark,
    userId,
    username,
    initialCustomerId,
    finalCustomerId,
    proposalCode,
    generalProjectCode,
    projectCodeId,
    userDefinedMonthlyFeeWithDiscount,
    brand,
    type,
    status,
    structures,
    totalPackagePrice,
  } = req.body;
  console.log("generalProjectCode", generalProjectCode);

  if (
    !id ||
    !planId ||
    !userId ||
    !username ||
    !initialCustomerId ||
    !brand ||
    !status ||
    !type ||
    !structures
  )
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const plan = await Plan.findById(id).exec();
  if (!plan)
    return res.status(400).json({ message: "BAD REQUEST : Plan not found" });

  const duplicate = await Plan.findOne({ planId }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate plan name" });

  plan.userId = userId;
  plan.mark = mark;
  plan.username = username;
  plan.planId = planId;
  plan.proposalCode = proposalCode;
  plan.generalProjectCode = generalProjectCode;
  plan.initialCustomerId = initialCustomerId;
  plan.finalCustomerId = finalCustomerId;
  plan.projectCodeId = projectCodeId;
  plan.userDefinedMonthlyFeeWithDiscount = userDefinedMonthlyFeeWithDiscount;
  plan.brand = brand;
  plan.type = type;
  plan.status = status;
  plan.structures = structures;
  plan.totalPackagePrice = totalPackagePrice;

  if (status === "done") {
    await updateStructures(structures, false);
  } else {
    await updateStructures(structures, true);
  }
  const updatedPlan = await plan.save();

  res.json(`'${updatedPlan.planId}' updated`);
});

// @desc Delete a plan
// @route DELETE /plans
// @access Private
const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Plan ID required" });

  const plan = await Plan.findById(id).exec();
  if (!plan) return res.status(400).json({ message: "Plan not found" });

  const result = await plan.deleteOne();
  const reply = `Plan '${result.name}' with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc update plan structures when status done
// @middleware
// @access Private
async function updateStructures(structures, isAvailable) {
  const updatedStructures = [];

  for (const structure of structures) {
    const structureId = structure.structureId;
    const foundStructure = await Structure.findOne({ _id: structureId }).exec();
    if (foundStructure) {
      foundStructure.isAvailable = isAvailable;
      await foundStructure.save();
      updatedStructures.push(foundStructure);
    }
  }

  return updatedStructures;
}

module.exports = {
  getAllPlans,
  createNewPlan,
  updatePlan,
  deletePlan,
};
