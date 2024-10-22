const Box = require("../model/Box");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Structure = require("../model/Structure");
const moment = require("jalali-moment");

const updateStructuresOnBoxDeletion = async (boxId) => {
  try {
    const result = await Structure.updateMany(
      { parent: boxId },
      { $set: { isChosen: false, parent: "" } }
    );
    return result;
  } catch (error) {
    console.error("Error updating structures:", error);
    throw error;
  }
};

// @desc Archive expired boxes
// @access Private
const archiveExpiredBoxes = asyncHandler(async () => {
  const now = moment().unix();
  // Find expired boxes that are not yet archived
  const expiredBoxes = await Box.find({
    "duration.endDate": { $lt: now },
    isArchived: false,
  }).exec();

  if (!expiredBoxes.length) {
    console.log("No expired boxes found.");
  } else {
    for (const box of expiredBoxes) {
      box.isArchived = true;
      await box.save();
      console.log("Archived boxId:", box.boxId);

      await updateStructuresOnBoxDeletion(box.boxId);
    }
  }
});

// @desc Get all boxes
// @route GET /boxes
// @access Private
const getAllBoxes = asyncHandler(async (req, res) => {
  try {
    await archiveExpiredBoxes();

    const boxes = await Box.find().lean();
    if (!boxes?.length)
      return res.status(400).json({ message: "BAD REQUEST : No boxes found" });

    const boxesWithUser = await Promise.all(
      boxes.map(async (box) => {
        const user = await User.findById(box.userId).lean().exec();
        return { ...box, username: user.username };
      })
    );

    res.json(boxesWithUser);
  } catch (error) {
    console.error("Error fetching boxes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Create new box
// @route POST /boxes
// @access Private
const createNewBox = asyncHandler(async (req, res) => {
  const { boxId, userId, name, mark, duration, structures } = req.body;
  console.log("Request Body:", req.body); // Debugging line

  if (!boxId || !userId || !name || !mark || !duration || !structures)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const duplicate = await Box.findOne({ name, isArchived: false })
    .lean()
    .exec();
  if (duplicate)
    return res.status(409).json({ message: "CONFLICT :Duplicate box name" });

  const box = await Box.create({
    boxId,
    userId,
    name,
    mark,
    duration,
    structures,
  });

  if (box) {
    const updatedStructures = await updateStructures(
      structures,
      box.boxId,
      true
    );
    console.log("updatedStructures", updatedStructures);
    return res.status(201).json({
      message: `CREATED: Box ${req.body.name} created successfully!`,
      box,
      updatedStructures,
    });
  } else {
    return res
      .status(400)
      .json({ message: "BAD REQUEST: Invalid box data received" });
  }
});

// @desc Update a box
// @route PATCH /boxes
// @access Private
const updateBox = asyncHandler(async (req, res) => {
  const { id, boxId, userId, username, name, mark, duration, structures } =
    req.body;

  if (!id || !boxId || !userId || !name || !mark || !duration || !username)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const box = await Box.findById(id).exec();

  if (!box)
    return res.status(400).json({ message: "BAD REQUEST : Box not found" });

  const duplicate = await Box.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate box name" });

  const currentDate = new Date();
  if (duration.endDate && currentDate > new Date(duration.endDate * 1000)) {
    box.isArchived = true; // Assuming isArchived is a boolean field
  } else {
    box.isArchived = false;
  }

  box.userId = userId;
  box.username = username;
  box.boxId = boxId;
  box.name = name;
  box.mark = mark;
  box.duration = duration;
  box.structures = structures;

  // Update structures
  await updateStructures(structures, box.boxId, false);
  await box.save();

  res.json(`'${box.name}' updated`);
});

// @desc Create a structure and update the corresponding box
// @route POST /boxes/createStructureAndUpdate
// @access Private
const createStructureAndUpdateBox = asyncHandler(async (req, res) => {
  const { boxId, structures } = req.body;

  if (
    !boxId ||
    !structures ||
    !structures.userId ||
    !structures.name ||
    !structures.location
  ) {
    return res.status(400).json({
      message: "BAD REQUEST: Box ID, userId, name, and location are required",
    });
  }

  const {
    costs = {
      squareCost: 0,
      variableCosts: [{ figures: 0, name: "" }],
    },
    duration = { diff: 0, startDate: null, endDate: null },
    marks = {
      markOptions: {
        docSize: 0,
        face: "",
        length: 0,
        printSize: 0,
        style: "",
        width: 0,
      },
      name: "",
    },
    monthlyBaseFee = 0, // Provide a default value
  } = structures;

  if (
    isNaN(costs.fixedCosts?.dailyCost) ||
    isNaN(costs.fixedCosts?.monthlyCost) ||
    isNaN(monthlyBaseFee)
  ) {
    return res.status(400).json({
      message: "BAD REQUEST: Costs and monthlyBaseFee must be valid numbers.",
    });
  }

  try {
    const newStructure = await Structure.create({
      userId: structures.userId,
      name: structures.name,
      location: structures.location,
      parent: boxId,
      isChosen: true,
    });

    const boxStructure = {
      costs: {
        dailyVariableCost: 0,
        fixedCosts: {
          dailyCost: costs.fixedCosts?.dailyCost || 0,
          monthlyCost: costs.fixedCosts?.monthlyCost || 0,
          periodCost: costs.fixedCosts?.periodCost || 0,
          squareCost: costs.fixedCosts?.squareCost || 0, // Ensure a default value
        },
        monthlyVariableCost: 0,
        totalDailyCost: 0,
        totalMonthlyCost: 0,
        totalPeriodCost: 0,
        variableCosts: newStructure._id,
      },
      duration: {
        diff: duration.diff || 0,
        endDate: duration.endDate || new Date(), // Default to current date if missing
        startDate: duration.startDate || new Date(),
      },
      marks: {
        markOptions: {
          docSize: marks.markOptions?.docSize || 0, // Provide default values
          face: marks.markOptions?.face || "",
          length: marks.markOptions?.length || 0,
          printSize: marks.markOptions?.printSize || 0,
          style: marks.markOptions?.style || "",
          width: marks.markOptions?.width || 0,
        },
        name: marks.name || "",
      },
      monthlyBaseFee: monthlyBaseFee, // Ensure it's provided or has a default
      structureId: newStructure._id,
    };
    // Find and update the box with the new structure
    const box = await Box.findOne({ boxId: boxId });
    if (!box) {
      return res
        .status(404)
        .json({ message: "NOT FOUND: Box with the specified ID not found" });
    }

    // Push the new structure to the box's structures array
    box.structures.push(boxStructure);
    await box.save();

    const boxes = await Box.find().lean();
    const boxesWithUser = await Promise.all(
      boxes.map(async (box) => {
        const user = await User.findById(box.userId).lean().exec();
        return { ...box, username: user.username };
      })
    );

    const structures1 = await Structure.find().lean();
    const structures1WithUser = await Promise.all(
      structures1.map(async (structure) => {
        const user = await User.findById(structure.userId).lean().exec();
        return { ...structure, username: user.username };
      })
    );

    res.status(201).json({
      message: "Structure created and box updated successfully!",
      newStructure,
      updatedAllStructures: structures1WithUser,
      updatedAllBoxes: boxesWithUser,
    });
  } catch (error) {
    console.error("Error creating structure and updating box:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Delete a box
// @route DELETE /boxes
// @access Private
const deleteBox = asyncHandler(async (req, res) => {
  const { id, boxId } = req.body;

  await updateStructuresOnBoxDeletion(boxId);

  if (!id || !boxId)
    return res.status(400).json({ message: "Box ID required" });

  const box = await Box.findOne({ boxId }).exec();
  if (!box) return res.status(400).json({ message: "Box not found" });

  const result = await box.deleteOne();
  const reply = `Box '${result.name}' with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc Get a single box by ID
// @route GET /boxes/:id
// @access Private
const getBoxById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Box ID required" });

  const box = await Box.findById(id).lean().exec();

  if (!box) return res.status(404).json({ message: "Box not found" });

  const user = await User.findById(box.userId).lean().exec();
  const boxWithUser = { ...box, username: user.username };

  res.json(boxWithUser);
});

// @desc update box structures when create or update
// @middleware
// @access Private
const updateStructures = async (structures, boxId, isCreation) => {
  const updatedStructures = [];
  try {
    for (const structure of structures) {
      const structureId = structure.structureId;
      const foundStructure = await Structure.findById(structureId).exec();
      if (foundStructure) {
        foundStructure.isChosen = true;
        foundStructure.parent = boxId;
        await foundStructure.save();
        updatedStructures.push(foundStructure);
      } else {
        console.warn(`Structure with ID ${structureId} not found.`);
      }
    }

    if (!isCreation) {
      const removedStructures = await Structure.find({
        _id: { $nin: structures.map((s) => s.structureId) },
        parent: boxId,
      }).exec();
      for (const structure of removedStructures) {
        structure.isChosen = false;
        structure.parent = "";
        await structure.save();
      }
    }
  } catch (error) {
    console.error("Error updating structures:", error);
  }

  return updatedStructures;
};

// @desc update box structures when delete
// @middleware
// @access Private

module.exports = {
  getAllBoxes,
  createNewBox,
  updateBox,
  deleteBox,
  getBoxById,
  createStructureAndUpdateBox,
};
