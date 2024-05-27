const Assets = require("../model/ITassets");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Assets.find().lean();
  if (!assets?.length)
    return res.status(400).json({ message: "BAD REQUEST : No assets found" });

  const assetsWithUser = await Promise.all(
    assets.map(async (asset) => {
      const user = await User.findById(asset.userId).lean().exec();
      return { ...asset, username: user.username };
    })
  );

  res.json(assetsWithUser);
});

const createNewAsset = asyncHandler(async (req, res) => {
  const { userId, personel, department, unit, asset, describtion } = req.body;

  if (!userId || !personel || !asset)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const duplicate = await Assets.findOne({ asset }).lean().exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "CONFLICT :Duplicate structure name" });

  const itAsset = await Assets.create({
    userId,
    personel,
    department,
    unit,
    asset,
    describtion,
  });
  if (itAsset)
    return res.status(201).json({
      message: `CREATED: itAsset ${req.body.asset.name} created successfully!`,
    });
  else
    return res
      .status(400)
      .json({ message: "BAD REQUEST : Invalid asset data received" });
});

const updateAsset = asyncHandler(async (req, res) => {
  const { id, userId, personel, department, unit, asset, describtion } =
    req.body;

  if (!id || !userId || !personel || !asset)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const itAsset = await Assets.findById(id).exec();
  if (!itAsset)
    res.status(400).json({ message: "BAD REQUEST : itAsset not found" });

  const duplicate = await Assets.findOne({ asset }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate itAsset !" });

  // Update and store user
  itAsset.userId = userId;
  itAsset.personel = personel;
  itAsset.department = department;
  itAsset.unit = unit;
  itAsset.asset = asset;
  itAsset.describtion = describtion;

  const updateditAsset = await itAsset.save();

  res.json(`'${updateditAsset.asset.name}' updated`);
});

const deleteAsset = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Asset ID required" });

  const itAsset = await Assets.findById(id).exec();
  if (!itAsset) return res.status(400).json({ message: "itAsset not found" });

  const result = await itAsset.deleteOne();
  const reply = `itAsset '${result.asset.name}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllAssets,
  createNewAsset,
  updateAsset,
  deleteAsset,
};
