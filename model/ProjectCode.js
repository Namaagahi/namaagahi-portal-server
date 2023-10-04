const moment = require('jalali-moment')
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
      default: () => getEquivalentValue(moment(new Date().toISOString().slice(0, 10), 'YYYY-MM-DD').jYear()),
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
    month: {
      type: Number,
      required: false,
      min: 1,
      max: 12,
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

projectCodeSchema.pre('save', async function (next) {
  try {
    const { media, year, month } = this
    const counter = await this.constructor.generateCounter(media, year, month)
    this.code = generateProjectCode(media, year, counter, month)
    next()
  } catch (error) {
    next(error)
  }
})

function getEquivalentValue(persianYear) {
  if (persianYear < 1400) throw new Error('Invalid Persian year')
  return (persianYear - 1400) * 100
}

projectCodeSchema.statics.generateCounter = async function () {
  try {
    const count = await this.countDocuments()

    return count + 200
  } catch (error) {
    throw new Error('Error generating counter: ' + error.message)
  }
}

function generateProjectCode(media, year, counter, month) {
  const mediaCodeMap = {
    'BB': '10',
    'MTR': '20',
    'BUS': '30',
    'NMV': '40',
  }

  const mediaCode = mediaCodeMap[media] || '00' 
  const yearCode = getEquivalentValue(year)
  const counterCode = counter.toString().padStart(3, '0')
  const monthCode = month ? `-${month.toString().padStart(2, '0')}` : ''

  return `${media}${mediaCode}${yearCode}${counterCode}${monthCode}`
}

module.exports = mongoose.model('ProjectCode', projectCodeSchema)