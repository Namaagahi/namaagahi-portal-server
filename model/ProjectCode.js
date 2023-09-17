const moment = require('jalali-moment');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectCodeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    media: {
      type: String,
      required: true,
      enum: ['BB', 'MTR', 'BUS', 'NMV'],
    },
    year: {
      type: Number,
      default: () => getEquivalentValue(moment(new Date().toISOString().slice(0,10), 'YYYY-MM-DD').jYear())
    },
    finalCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'FinalCustomer',
    },
    brand: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, 
  }
)

function getEquivalentValue(persianYear) {

    if (persianYear < 1400) throw new Error('Invalid Persian year')
    const equivalentValue = ((persianYear - 1400) * 100)
    return equivalentValue
}

projectCodeSchema.pre('save', async function (next) {
  const mediaTypes = {
    BB: '10',
    MTR: '20',
    BUS: '30',
    NMV: '40',
  };

  if (!this.code) {
    const count = await this.constructor.countDocuments() + 100
    const counter = count + 1
    this.code = `${this.media}${mediaTypes[this.media]}${this.year}${counter.toString().padStart(3,'0')}`
  } else {
    const count = await this.constructor.countDocuments() + 100
    const counter = count + 1
    this.code = `${this.media}${mediaTypes[this.media]}${this.year}${counter.toString().padStart(3,'0')}`
  }

  next()
})

module.exports = mongoose.model('ProjectCode', projectCodeSchema)