const mongoose = require("mongoose");
const moment = require("jalali-moment");
const Schema = mongoose.Schema;

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number },
});

const Counter = mongoose.model("Counter", counterSchema);

const planSchema = new Schema(
  {
    planId: {
      type: Number,
      unique: true,
    },
    proposalCode: { type: String, unique: true },
    mark: {
      name: {
        type: String,
        required: true,
        enum: ["regular", "package"],
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    initialCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "InitialCustomer",
    },
    finalCustomerId: {
      type: String,
      required: false,
      default: "",
    },
    projectCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "ProjectCode",
      default: null,
      validate: {
        validator: function (value) {
          return value === null || mongoose.Types.ObjectId.isValid(value);
        },
        message: "Invalid projectCodeId",
      },
    },
    brand: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "suggested",
    },
    userDefinedMonthlyFeeWithDiscount: {
      type: Boolean,
      default: true,
    },
    structures: [
      {
        structureId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Structure",
        },
        structureRecord: {
          type: {},
          required: true,
        },
        discountFee: {
          type: String,
          required: false,
        },
        discountType: {
          type: String,
          required: false,
          enum: ["percentage", "number"],
          default: "percentage",
        },
        monthlyFee: {
          type: Number,
          required: true,
        },
        monthlyFeeWithDiscount: {
          type: Number,
          required: false,
        },
        duration: {
          sellStart: {
            type: Number,
            required: true,
          },
          sellEnd: {
            type: Number,
            required: true,
          },
          diff: {
            type: Number,
            required: false,
          },
        },
        percentage: {
          type: Number,
          required: false,
        },
        totalPeriodCost: {
          type: Number,
          required: false,
        },
        calculatedInPackageFee: {
          type: Number,
          required: false,
        },
      },
    ],
    totalMonthlyFee: {
      type: Number,
      required: false,
    },
    totalPackagePrice: {
      type: Number,
      required: function () {
        return this.mark.name === "package";
      },
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

planSchema.virtual("structures.structureDurationDiff").get(function () {
  return this.structures.map((structure) => {
    return (
      moment(structure.duration.sellEnd * 1000).diff(
        moment(structure.duration.sellStart * 1000),
        "days"
      ) + 1
    );
  });
});

planSchema.pre("save", function (next) {
  const doc = this;

  const totalMonthlyFee = doc.structures.reduce((total, structure) => {
    return total + structure.monthlyFee;
  }, 0);
  doc.totalMonthlyFee = totalMonthlyFee;

  doc.structures.forEach((structure, index) => {
    if (
      doc.isNew ||
      typeof structure.duration.diff === "undefined" ||
      structure.duration.diff === null
    ) {
      const structureDiff =
        moment(structure.duration.sellEnd * 1000).diff(
          moment(structure.duration.sellStart * 1000),
          "days"
        ) + 1;
      doc.structures[index].duration.diff = structureDiff;
    }
  });

  doc.structures.forEach((structure, index) => {
    if (
      doc.isNew ||
      typeof structure.percentage === "undefined" ||
      structure.percentage === null
    ) {
      const percentage = structure.monthlyFee / doc.totalMonthlyFee;
      doc.structures[index].percentage = percentage;
    }
  });

  doc.structures.forEach((structure, index) => {
    if (
      structure.isModified("totalPeriodCost") ||
      structure.isModified("monthlyFeeWithDiscount") ||
      structure.isModified("duration.diff") ||
      structure.isModified("calculatedInPackageFee") ||
      structure.isModified("discountFee") ||
      structure.isModified("monthlyFee")
    ) {
      if (doc.mark.name === "regular") {
        console.log("THIS IS BEING CALLEDDDDDDDDDDDDDD!");
        if (doc.userDefinedMonthlyFeeWithDiscount) {
          if (structure.discountType === "percentage") {
            const totalPeriodCost =
              (structure.monthlyFeeWithDiscount / 30) * structure.duration.diff;
            doc.structures[index].totalPeriodCost = totalPeriodCost;
            structure.discountFee =
              100 -
              (structure.monthlyFeeWithDiscount * 100) / structure.monthlyFee;
          }
        } else {
          structure.monthlyFeeWithDiscount =
            structure.monthlyFee -
            structure.monthlyFee * (structure.discountFee / 100);
          const totalPeriodCost =
            (structure.monthlyFeeWithDiscount / 30) * structure.duration.diff;
          doc.structures[index].totalPeriodCost = totalPeriodCost;
        }
      } else {
        const totalPeriodCost =
          (structure.calculatedInPackageFee / 30) * structure.duration.diff;
        doc.structures[index].totalPeriodCost = totalPeriodCost;
      }
    }
    if (doc.userDefinedMonthlyFeeWithDiscount) {
      if (structure.discountType === "percentage") {
        const monthlyFeeWithDiscount = structure.monthlyFeeWithDiscount;
        structure.discountFee =
          100 - (monthlyFeeWithDiscount * 100) / structure.monthlyFee;
      } else if (structure.discountType === "number") {
        structure.monthlyFeeWithDiscount =
          structure.monthlyFee - structure.discountFee;
      }
    } else {
      const totalPeriodCost =
        (structure.monthlyFeeWithDiscount / 30) * structure.duration.diff;
      doc.structures[index].totalPeriodCost = totalPeriodCost;
    }
  });

  doc.structures.forEach((structure, index) => {
    if (structure.isModified("percentage")) {
      const percentage = structure.monthlyFee / doc.totalMonthlyFee;
      doc.structures[index].percentage = percentage;
    }
  });

  doc.structures.forEach((structure, index) => {
    if (
      structure.isModified("duration.sellStart") ||
      structure.isModified("duration.sellEnd")
    ) {
      const structureDiff =
        moment(structure.duration.sellEnd * 1000).diff(
          moment(structure.duration.sellStart * 1000),
          "days"
        ) + 1;
      doc.structures[index].duration.diff = structureDiff;
    }
  });

  doc.structures.forEach((structure, index) => {
    if (doc.totalPackagePrice !== null && doc.totalPackagePrice !== undefined) {
      const calculatedInPackageFee =
        ((doc.totalPackagePrice * structure.percentage) /
          structure.duration.diff) *
        30;
      console.log("calculatedInPackageFee", calculatedInPackageFee);
      doc.structures[index].calculatedInPackageFee = calculatedInPackageFee;
    }
  });

  doc.structures.forEach((structure, index) => {
    if (
      doc.isNew ||
      typeof structure.totalPeriodCost === "undefined" ||
      structure.totalPeriodCost === null
    ) {
      if (doc.mark.name === "regular") {
        const totalPeriodCost =
          (structure.monthlyFeeWithDiscount / 30) * structure.duration.diff;
        doc.structures[index].totalPeriodCost = totalPeriodCost;
      } else {
        const totalPeriodCost =
          (structure.calculatedInPackageFee / 30) * structure.duration.diff;
        doc.structures[index].totalPeriodCost = totalPeriodCost;
      }
    }
  });

  next();
});

planSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findById("planId").exec();
    if (!counter) await Counter.create({ _id: "planId", sequence_value: 1000 });

    const updatedCounter = await Counter.findByIdAndUpdate(
      "planId",
      { $inc: { sequence_value: 1 } },
      { new: true }
    );
    this.planId = updatedCounter.sequence_value;
  }

  next();
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
