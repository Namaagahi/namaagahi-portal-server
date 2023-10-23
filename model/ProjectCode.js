const moment = require('jalali-moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let customCounter = 201; // Initialize your custom counter

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
      unique: false,
    },
  },
  {
    timestamps: true,
  }
)

projectCodeSchema.pre('save', async function (next) {
  const doc = this;

  try {
    const { media, year, month, code } = this;

    if (doc.isNew) {
      if (!doc.code) {
        const generatedCode = generateProjectCode(media, year, generateCounter())
        doc.code = generatedCode
      }

      if (doc.code && doc.month) {
        const generatedCode = expandProjectCode(code, month);
        doc.code = generatedCode;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

function getEquivalentValue(persianYear) {
  if (persianYear < 1400) throw new Error('Invalid Persian year');
  return (persianYear - 1400) * 100;
}

function generateCounter () {
  return customCounter++
}

function generateProjectCode(media, year, counter) {
  const mediaCodeMap = {
    'BB': '10',
    'MTR': '20',
    'BUS': '30',
    'NMV': '40',
  }

  const mediaCode = mediaCodeMap[media] || '00';
  const yearCode = getEquivalentValue(year);
  return `${media}${mediaCode}${yearCode}${counter}`;
}

function expandProjectCode(code, month) {
  return `${code}-${month.toString().padStart(2, '0')}`;
}

module.exports = mongoose.model('ProjectCode', projectCodeSchema);