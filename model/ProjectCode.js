const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mediaTypes = ['billboard', 'metro', 'bus', 'namava']

const projectCodeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    media: {
        type: String,
        required: true,
        enum: mediaTypes
    },
    year: {
        type: Number,
        required: true,
        default: 402
    },
    finalCustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FinalCustomer'
    },
    brand: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false,
        unique: true
    }
},
{
    timestamps: true
}
)

projectCodeSchema.pre('save', async function (next) {
    try {
      const mediaCode = this.media.substring(0, 2).toUpperCase()
      const yearCode = (this.year % 100).toString().padStart(2, '0')
      const counterCode = await this.constructor.countDocuments()
  
      this.code = `${mediaCode}10${yearCode}${counterCode}`
  
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = mongoose.model('ProjectCode', projectCodeSchema)
