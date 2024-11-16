const moment = require("jalali-moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generalProjectCodeCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number },
});

const GeneralProjectCodeCounter = mongoose.model(
  "GeneralProjectCodeCounter",
  generalProjectCodeCounterSchema
);

const generalProjectCodeSchema = new Schema(
  {
    count: {
      type: Number,
      unique: false,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    year: {
      type: Number,
      default: () =>
        getEquivalentValue(
          moment(new Date().toISOString().slice(0, 10), "YYYY-MM-DD").jYear()
        ),
    },
    identityCode: {
      type: String,
      unique: false,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

generalProjectCodeSchema.pre("save", async function (next) {
  const doc = this;

  if (doc.isNew) {
    try {
      // Initialize or update the counter
      const counter = await GeneralProjectCodeCounter.findById("count");
      if (!counter) {
        await GeneralProjectCodeCounter.create({
          _id: "count",
          sequence_value: 1,
        });
      }

      const updatedCounter = await GeneralProjectCodeCounter.findByIdAndUpdate(
        "count",
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      // Set count and generate code field
      doc.count = updatedCounter.sequence_value;
      const counterStr = String(doc.count).padStart(3, "0"); // Format as "001", "002", etc.
      const yearCode = getEquivalentValue(doc.year);
      doc.code = `${counterStr}${doc.identityCode}${yearCode}`;

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Helper function to get the year in the desired format
function getEquivalentValue(persianYear) {
  if (persianYear < 1400) throw new Error("Invalid Persian year");
  const yearValue = (persianYear - 1400).toString().padStart(2, "0"); // Ensures at least two characters
  return yearValue;
}

module.exports = mongoose.model("GeneralProjectCode", generalProjectCodeSchema);
