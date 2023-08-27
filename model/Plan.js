const mongoose = require('mongoose')
const moment = require('jalali-moment')
const Schema = mongoose.Schema

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number },
  })
  
const Counter = mongoose.model('Counter', counterSchema)

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
        initialCustomerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'InitialCustomer'
        },
        finalCustomerId: {
            type: String,
            required: false,
            default: ''
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
                }
            },
            totalPeriodCost: {
                type: Number,
                required: false,
            }
        }]
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

planSchema.virtual('structures.structureDurationDiff').get(function() {
    return this.structures.map(structure => {
        return ((moment.unix(structure.duration.sellEnd).diff((moment.unix(structure.duration.sellStart)), 'days')) + 1)
        // return moment((new Date(structure.duration.sellEnd).toISOString().substring(0, 10)), 'jYYYY-jMM-jDD').diff
        // (moment((new Date(structure.duration.sellStart).toISOString().substring(0, 10)), 'jYYYY-jMM-jDD'), 'days') + 1
    })
})

planSchema.pre('validate', function(next) {
    const doc = this;
  
    doc.structures.forEach((structure, index) => {
      if (doc.isNew || typeof structure.duration.diff === 'undefined' || structure.duration.diff === null) {
        const diff = (moment.unix(doc.duration.sellEnd).diff((moment.unix(doc.duration.sellStart)), 'days')) + 1
        // const diff = moment((new Date(structure.duration.sellEnd).toISOString().substring(0, 10)), 'jYYYY-jMM-jDD').diff
        // (moment((new Date(structure.duration.sellStart).toISOString().substring(0, 10)), 'jYYYY-jMM-jDD'), 'days') + 1
        doc.structures[index].duration.diff = diff
      }
    })

    doc.structures.forEach((structure, index) => {
        if (doc.isNew || typeof structure.totalPeriodCost === 'undefined' || structure.totalPeriodCost === null) {
            const totalPeriodCost = (structure.monthlyFeeWithDiscount / 30) * structure.duration.diff
            doc.structures[index].totalPeriodCost = totalPeriodCost
        }
    })
  
    next()

  })

planSchema.pre('save', async function (next) {
    if (this.isNew) {
      const counter = await Counter.findById('planId').exec();
      if (!counter) await Counter.create({ _id: 'planId', sequence_value: 1000 })
      
      const updatedCounter = await Counter.findByIdAndUpdate(
        'planId',
        { $inc: { sequence_value: 1 } },
        { new: true }
      )
      this.planId = updatedCounter.sequence_value
    }

    next()

  })

  const Plan = mongoose.model('Plan', planSchema);
  
  module.exports = Plan;
