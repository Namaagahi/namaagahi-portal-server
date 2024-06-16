const Proposal = require("../model/Proposal");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const { io, connectedUsers } = require("../config/io");

// @desc Get all proposals
// @route GET /proposal
// @access Private
const getAllProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find().lean();
  if (!proposals?.length)
    return res.status(400).json({ message: "BAD REQUEST: No proposals found" });

  const proposalWithUser = await Promise.all(
    proposals.map(async (proposal) => {
      const user = await User.findById(proposal.userId).lean().exec();
      return { ...proposal, username: user.username };
    })
  );

  res.json(proposalWithUser);
});

// @desc Create a new proposal
// @route POST /proposal
// @access Private
const createProposal = asyncHandler(async (req, res) => {
  const {
    userId,
    subject,
    initialCustomerId,
    startDate,
    endDate,
    priority,
    status,
    type,
    description,
    assignedUsers,
  } = req.body;

  // Create the proposal
  try {
    if (
      !subject ||
      !startDate ||
      !endDate ||
      !priority ||
      !type ||
      !assignedUsers ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Required fields are missing.",
      });
    }

    const duplicate = await Proposal.findOne({ subject }).lean().exec();
    if (duplicate)
      return res.status(409).json({
        success: false,
        message: "CONFLICT :Duplicate proposal subject",
      });

    const proposal = new Proposal({
      userId,
      subject,
      initialCustomerId,
      startDate,
      endDate,
      priority,
      status,
      type,
      description,
      assignedUsers,
    });

    const savedProposal = await proposal.save();
    const proposalAssignedUsers = savedProposal.assignedUsers;

    proposalAssignedUsers.forEach((userId) => {
      const userSocket = connectedUsers[userId];
      if (userSocket) {
        userSocket.emit("newProposal", { proposal: savedProposal });
      }
    });

    res.status(200).json({
      success: true,
      message: `CREATED: Proposal ${req.body.subject} created successfully!`,
    });
  } catch (error) {
    console.log("PROPOSAL/POST ERR", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to create a proposal.",
    });
  }
});

// @desc Update a proposal
// @route PUT /proposal/:id
// @access Private
const updateProposal = asyncHandler(async (req, res) => {
  const {
    proposalId,
    subject,
    startDate,
    endDate,
    priority,
    status,
    type,
    description,
    assignedUsers,
  } = req.body;

  if (
    !proposalId ||
    !subject ||
    !startDate ||
    !endDate ||
    !priority ||
    !status ||
    !type ||
    !description ||
    !assignedUsers
  )
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const proposal = await Proposal.findById(proposalId).exec();
  if (!proposal)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : proposal not found" });

  // Update the proposal
  proposal.proposalId = proposalId;
  proposal.subject = subject;
  proposal.startDate = startDate;
  proposal.endDate = endDate;
  proposal.priority = priority;
  proposal.status = status;
  proposal.type = type;
  proposal.description = description;
  proposal.assignedUsers = assignedUsers;

  const updateditProposal = await proposal.save();
  res.status(200).json(`'${updateditProposal.subject}' updated`);
});

// @desc Delete a proposal
// @route DELETE /proposals
// @access Private
const deleteProposal = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res.status(400).json({
      success: false,
      message: "Proposal ID required",
    });

  const proposal = await Proposal.findByIdAndDelete(id);

  if (!proposal)
    return res.status(400).json({
      success: false,
      message: "Proposal not found",
    });

  res.status(200).json({
    success: true,
    message: `DELETED: Proposal ${proposal.subject} deleted successfully!`,
  });
});

module.exports = {
  getAllProposals,
  createProposal,
  deleteProposal,
  updateProposal,
};
