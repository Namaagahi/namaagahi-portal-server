const mongoose = require('mongoose')
const moment = require('moment-jalaali');
const Schema = mongoose.Schema

const structureSchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
        },
        duration: {
            startDate: {
                type: String,
                required: true
            },
            startDateJ: {
                type: String,
                required: true,
                default: function() {
                    const gregorianDate = moment(this.duration.startDate, 'YYYY-MM-DD')
                    return gregorianDate.format('jYYYY-jMM-jDD');
                }
            },
            endDate: {
                type: String,
                required: true
            },
            endDateJ: {
                type: String,
                required: true,
                default: function() {
                    const gregorianDate = moment(this.duration.endDate, 'YYYY-MM-DD')
                    return gregorianDate.format('jYYYY-jMM-jDD');
                }
            },
            diff: {
                type: Number,
                required: true,
                default: function() {
                    return moment(this.duration.endDateJ, 'jYYYY-jMM-jDD').diff(moment(this.duration.startDateJ, 'jYYYY-jMM-jDD'), 'days') + 1
                }
            }
        },
        type: {
            name: {
                type: String,
                required: true  
            },
            typeOptions: {
                style: {
                    type: String,
                    required: true
                },
                face: {
                    type: String,
                    required: true
                },
                length: {
                    type: Number,
                    required: true
                }, 
                width: {
                    type: Number,
                    required: true
                }, 
                printSize: {
                    type: Number,
                    required: true
                },
                docSize: {
                    type: Number,
                    required: true
                },
            }
        },
        location: {
            district: {
                type: Number,
                required: true
            },
            path: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
        },
        costs: {
            fixedCosts: {
                squareCost: {
                    type: Number,
                    required: true
                },
                monthlyCost: {
                    type: Number,
                    required: true,
                    default: function() {
                      return this.type.typeOptions.docSize * this.costs.fixedCosts.squareCost
                    }
                },
                periodCost: {
                    type: Number,
                    required: true,
                    default: function() {
                      return (this.costs.fixedCosts.monthlyCost / 30) * (this.duration.diff)
                    }
                }
            },
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Structure', structureSchema)