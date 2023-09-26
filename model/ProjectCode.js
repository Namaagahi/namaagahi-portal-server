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
    jalaliMonth: {
      type: String,
      required: false,
      enum: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', ]
    },
    children: {
      type: [String],
      default: [],
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
    const count = await this.constructor.countDocuments() + 200
    const counter = count + 1
    this.code = `${this.media}${mediaTypes[this.media]}${this.year}${counter.toString().padStart(3,'0')}`
  } else {
    const count = await this.constructor.countDocuments() + 200
    const counter = count + 1
    this.code = `${this.media}${mediaTypes[this.media]}${this.year}${counter.toString().padStart(3,'0')}`
  }

  if (this.isModified) {
    const parentCode = await this.constructor.findOne({ code: this.parentCode }).exec()
    if (parentCode) {
      const childCode = `${parentCode.code}-${this.jalaliMonth}`
      parentCode.children.push(childCode)
      await parentCode.save()
    }
  }

  next()
})

module.exports = mongoose.model('ProjectCode', projectCodeSchema)