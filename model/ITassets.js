const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ITassetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    personel: {
      name: {
        type: String,
        required: true,
      },
      code: {
        type: Number,
        required: true,
      },
    },
    department: {
      type: String,
      required: false,
      default: "",
    },
    unit: {
      type: String,
      required: false,
      default: "",
    },
    asset: {
      name: {
        type: String,
        required: true,
      },
      serial: {
        type: String,
        required: true,
      },
      code: {
        type: Number,
        required: true,
      },
    },
    describtion: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ITasset", ITassetSchema);
