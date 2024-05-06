const moment = require("jalali-moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectCodeCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number },
});

const ProjectCodeCounter = mongoose.model(
  "ProjectCodeCounter",
  projectCodeCounterSchema
);

const projectCodeSchema = new Schema(
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
    media: {
      type: String,
      required: true,
      enum: ["BB", "MTR", "BUS", "NMV"],
    },
    year: {
      type: Number,
      default: () =>
        getEquivalentValue(
          moment(new Date().toISOString().slice(0, 10), "YYYY-MM-DD").jYear()
        ),
    },
    finalCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "FinalCustomer",
    },
    brand: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    month: {
      type: Number,
      required: false,
      min: 1,
      max: 12,
    },
    code: {
      type: String,
      required: false,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

projectCodeSchema.pre("save", async function (next) {
  const doc = this;

  try {
    const { media, year, month, code } = this;

    if (doc.isNew) {
      if (!month && !code) {
        const counter = await ProjectCodeCounter.findById("count").exec();
        if (!counter)
          await ProjectCodeCounter.create({
            _id: "count",
            sequence_value: 200,
          });

        const updatedCounter = await ProjectCodeCounter.findByIdAndUpdate(
          "count",
          { $inc: { sequence_value: 1 } },
          { new: true }
        );
        doc.count = updatedCounter.sequence_value;
      }

      if (!doc.code) {
        const generatedCode = generateProjectCode(
          media,
          year,
          generateCounter(doc.count)
        );
        doc.code = generatedCode;
      }

      if (code && month) {
        const generatedCode = expandProjectCode(code, month);
        doc.code = generatedCode;
        doc.count = Math.random(new Date().getTime()).toFixed(3);
      }
      if (code) {
        const generatedCode = expandProjectCode(code);
        doc.code = generatedCode;
        doc.count = Math.random(new Date().getTime()).toFixed(3);
      }
    } else {
      if (doc.isModified("media") || doc.isModified("year")) {
        doc.code = generateProjectCode(media, year, doc.count);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

function getEquivalentValue(persianYear) {
  if (persianYear < 1400) throw new Error("Invalid Persian year");
  return (persianYear - 1400) * 100;
}

function generateCounter(count) {
  return count++;
}

function generateProjectCode(media, year, counter) {
  const mediaCodeMap = {
    BB: "10",
    MTR: "20",
    BUS: "30",
    NMV: "40",
  };

  const mediaCode = mediaCodeMap[media] || "00";
  const yearCode = getEquivalentValue(year);
  return `${media}${mediaCode}${yearCode}${counter}`;
}

function expandProjectCode(code, month) {
  if (month) return `${code}-${month.toString().padStart(2, "0")}`;
  return `${code}`;
}

module.exports = mongoose.model("ProjectCode", projectCodeSchema);
