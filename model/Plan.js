const mongoose = require('mongoose')
const moment = require('moment-jalaali')
const Schema = mongoose.Schema

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number },
  });
  
const Counter = mongoose.model('Counter', counterSchema);

const planSchema = new Schema({
        planId: {
            type: Number,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        customerName: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'InitialCustomer'
        },
        brand: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'suggested'
        },
        structures: [{
            structureId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Structure'
            },
            structureRecord: {
                type: {},
                required: true
            },
            discountFee: {
                type: String,
                required: true
            },
            discountType: {
                type: String,
                required: true
            },
            monthlyFee: {
                type: Number,
                required: true
            },
            monthlyFeeWithDiscount: {
                type: Number,
                required: true
            },
            duration: {
                sellStart: {
                    type: String,
                    required: true,
                },
                sellEnd: {
                    type: String,
                    required: true,
                },
                diff: {
                    type: Number,
                    required: false,
                    default: function() {
                        return moment(this.duration.sellEnd, 'jYYYY-jMM-jDD').diff(moment(this.duration.sellStart, 'jYYYY-jMM-jDD'), 'days') + 1
                    }
                }
            },
        }]
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

planSchema.pre('save', async function (next) {
    if (this.isNew) {
      const counter = await Counter.findById('planId').exec();
      if (!counter) {
        await Counter.create({ _id: 'planId', sequence_value: 1000 });
      }
      const updatedCounter = await Counter.findByIdAndUpdate(
        'planId',
        { $inc: { sequence_value: 1 } },
        { new: true }
      );
      this.planId = updatedCounter.sequence_value;
    }
    next();
  });

  const Plan = mongoose.model('Plan', planSchema);
  
  module.exports = Plan;
