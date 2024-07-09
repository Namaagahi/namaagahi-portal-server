const mongoose = require("mongoose");
const moment = require("jalali-moment");
const Schema = mongoose.Schema;

const boxSchema = new Schema(
  {
    boxId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    mark: {
      name: {
        type: String,
        required: true,
      },
      markOptions: {
        projectNumber: {
          type: String,
          required: false,
        },
        brand: {
          type: String,
          required: false,
        },
      },
    },
    duration: {
      startDate: {
        type: Number,
        required: true,
      },
      endDate: {
        type: Number,
        required: true,
      },
      diff: {
        type: Number,
        required: false,
      },
    },
    structures: [
      {
        structureId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Structure",
        },
        duration: {
          startDate: {
            type: Number,
            required: true,
            default: function () {
              return this.parent().duration.startDate;
            },
          },
          endDate: {
            type: Number,
            required: true,
            default: function () {
              return this.parent().duration.endDate;
            },
          },
          diff: {
            type: Number,
            required: false,
          },
        },
        marks: {
          name: {
            type: String,
            required: true,
          },
          markOptions: {
            style: {
              type: String,
              required: true,
            },
            face: {
              type: String,
              required: true,
            },
            length: {
              type: String,
              required: true,
            },
            width: {
              type: String,
              required: true,
            },
            printSize: {
              type: Number,
              required: true,
            },
            docSize: {
              type: Number,
              required: true,
            },
          },
        },
        costs: {
          fixedCosts: {
            squareCost: {
              type: Number,
              required: true,
            },
            monthlyCost: {
              type: Number,
              required: false,
              default: function () {
                return (
                  this.marks.markOptions.docSize *
                  this.costs.fixedCosts.squareCost
                );
              },
            },
            dailyCost: {
              type: Number,
              required: false,
              default: function () {
                return this.costs.fixedCosts.monthlyCost / 30;
              },
            },
            periodCost: {
              type: Number,
              required: false,
            },
          },
          variableCosts: [
            {
              name: {
                type: String,
                required: false,
              },
              figures: {
                monthlyCost: {
                  type: Number,
                  required: false,
                },
                periodCost: {
                  type: Number,
                  required: false,
                },
                dailyCost: {
                  type: Number,
                  required: false,
                  default: function () {
                    return this.figures?.monthlyCost
                      ? this.figures.monthlyCost / 30
                      : 0;
                  },
                },
              },
            },
          ],
          dailyVariableCost: {
            type: Number,
            required: true,
            default: function () {
              return (
                this.costs?.variableCosts?.reduce((acc, curr) => {
                  return acc + (curr.figures?.dailyCost || 0);
                }, 0) || 0
              );
            },
          },
          monthlyVariableCost: {
            type: Number,
            required: true,
            default: function () {
              return (
                this.costs?.variableCosts?.reduce((acc, curr) => {
                  return acc + (curr.figures?.monthlyCost || 0);
                }, 0) || 0
              );
            },
          },
          totalDailyCost: {
            type: Number,
            required: true,
            default: function () {
              return (
                (this.costs?.fixedCosts?.dailyCost || 0) +
                (this.costs?.dailyVariableCost || 0)
              );
            },
          },
          totalMonthlyCost: {
            type: Number,
            required: true,
            default: function () {
              return (
                (this.costs?.monthlyVariableCost || 0) +
                (this.costs?.fixedCosts?.monthlyCost || 0)
              );
            },
          },
          totalPeriodCost: {
            type: Number,
            required: true,
            default: function () {
              const diff = this.parent().duration.diff ?? 0;
              return (this.costs?.totalDailyCost || 0) * diff;
            },
          },
        },
        monthlyBaseFee: {
          type: Number,
          required: true,
        },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    optimisticConcurrency: true,
    versionKey: "version",
  }
);

boxSchema.pre("save", function (next) {
  const doc = this;

  if (doc.isNew || doc.isModified("duration")) {
    const diff =
      moment
        .unix(doc.duration.endDate)
        .diff(moment.unix(doc.duration.startDate), "days") + 1;
    doc.duration.diff = diff;
  }

  doc.structures.forEach((structure) => {
    if (doc.isNew) {
      structure.duration.startDate = doc.duration.startDate;
      structure.duration.endDate = doc.duration.endDate;
    }
  });

  doc.structures.forEach((structure) => {
    if (doc.isModified) {
      const structureDiff =
        moment
          .unix(structure.duration.endDate)
          .diff(moment.unix(structure.duration.startDate), "days") + 1;
      structure.duration.diff = structureDiff;
      structure.costs.fixedCosts.monthlyCost =
        structure.marks.markOptions.docSize *
        structure.costs.fixedCosts.squareCost;
      structure.costs.fixedCosts.dailyCost =
        structure.costs.fixedCosts.monthlyCost / 30;
      structure.costs.fixedCosts.periodCost =
        (structure.costs.fixedCosts.monthlyCost / 30) * structure.duration.diff;
    }
  });

  let dailyVariableCost = 0;
  doc.structures.forEach((structure) => {
    structure.costs.variableCosts.forEach((variableCost) => {
      dailyVariableCost += variableCost.figures?.dailyCost || 0;
    });
    structure.costs.dailyVariableCost = dailyVariableCost;
    structure.costs.totalDailyCost =
      (structure.costs.fixedCosts.dailyCost || 0) + dailyVariableCost;
    structure.costs.totalMonthlyCost =
      structure.costs.monthlyVariableCost +
      structure.costs.fixedCosts.monthlyCost;
    structure.costs.totalPeriodCost =
      structure.costs.totalDailyCost * structure.duration.diff;
  });

  doc.structures.forEach((structure) => {
    if (
      structure.costs.variableCosts &&
      structure.costs.variableCosts.length > 0
    ) {
      structure.costs.variableCosts.forEach((variableCost) => {
        if (variableCost.figures.monthlyCost) {
          const monthlyCost = variableCost.figures.monthlyCost;
          const durationDiff = structure.duration.diff;

          const periodCost = (monthlyCost / 30) * durationDiff;
          variableCost.figures.periodCost = periodCost;

          const dailyCost = monthlyCost / 30;
          variableCost.figures.dailyCost = dailyCost;
        }
      });
    }
  });

  next();
});

module.exports = mongoose.model("Box", boxSchema);
