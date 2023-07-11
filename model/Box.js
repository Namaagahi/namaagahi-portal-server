const mongoose = require('mongoose')
const moment = require('moment-jalaali');
const Schema = mongoose.Schema

const boxSchema = new Schema({
        boxId: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        mark: {
            name: {
                type: String,
                required: true  
            },
            markOptions: {
                projectNumber: {
                    type: String,
                    required: false
                },
                brand: {
                    type: String,
                    required: false
                }
            }
        },
        duration:{
            startDate: {
                type: String,
                required: true
            },
            endDate: {
                type: String,
                required: true
            },
            diff: {
                type: Number,
                required: false,
                default: function() {
                    return moment(this.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(this.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
                }
            }
        }, 
        structures: [{
            structureId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Structure'
            },
            duration: {
                startDate: {
                    type: String,
                    required: true,
                    default: function() {
                        console.log("THIS STRUCTURE", this)
                        return this.parent().duration.startDate
                    }
                },
                endDate: {
                    type: String,
                    required: true,
                    default: function() {
                        return this.parent().duration.endDate
                    }
                },
                diff: {
                    type: Number,
                    required: false,
                }
            },
            marks: {
                name: {
                    type: String,
                    required: true  
                },
                markOptions: {
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
                    }
                }
            },
            costs: {
                fixedCosts: {
                    squareCost: {
                        type: Number,
                        required: true
                    },
                    monthlyCost: {
                        type: Number,
                        required: false,
                        default: function() {
                            console.log(this)
                            return this.marks.markOptions.docSize * this.costs.fixedCosts.squareCost
                        }
                    },
                    dailyCost: {
                        type: Number,
                        required: false,
                        default: function() {
                            return this.costs.fixedCosts.monthlyCost / 30
                        }
                    },
                    periodCost: {
                        type: Number,
                        required: false,
                    },
                },
                variableCosts: [{
                    name: {
                        type: String,
                        required: true
                    },
                    figures: {
                        monthlyCost: {
                            type: Number,
                            required: true
                        },
                        periodCost: {
                            type: Number,
                            required: false,
                            default: function() {
                                return (this.figures.monthlyCost / 30) * 365  
                            }
                        },
                        dailyCost: {
                            type: Number,
                            required: false,
                            default: function() {
                                return this.figures.monthlyCost / 30
                            }
                        }
                    }
                }],
                dailyVariableCost: {
                    type: Number,
                    required: true,
                    default: function() {
                        return this.costs.variableCosts.reduce((acc, curr) => {
                            return acc + curr.figures.dailyCost;
                          }, 0)
                    }
                },
                totalDailyCost: {
                    type: Number,
                    required: true,
                    default: function() {
                        return this.costs.fixedCosts.dailyCost + this.costs.dailyVariableCost
                    }
                },
                totalMonthlyCost: {
                    type: Number,
                    required: true,
                    default: function() {
                        return (this.costs.totalDailyCost) * 30
                    }
                },
                totalPeriodCost: {
                    type: Number,
                    required: true,
                    default: function() {
                        const diff = this.parent().duration.diff ?? 0
                        return this.costs.totalDailyCost * diff
                    }
                }
            },
        }]
    }
,
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
) 


boxSchema.virtual('structures.structureDurationDiff').get(function() {
    return this.structures.map(structure => {
        return moment(structure.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(structure.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
    })
})

boxSchema.virtual('structures.structureFixedPeriodCost').get(function() {
    return this.structures.map(structure => {
        return (structure.costs.fixedCosts.monthlyCost / 30) * structure.duration.diff
    })
})

boxSchema.pre('save', function(next) {
    const doc = this

    if (doc.isNew || doc.isModified('duration')) {
        const diff = moment(doc.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(doc.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
        doc.duration.diff = diff
    }

    doc.structures.forEach((structure, index) => {
        if (doc.isNew || doc.isNullOrUndefined(structure.duration.diff)) {
            const diff = moment(structure.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(structure.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
            doc.structures[index].duration.diff = diff
        }
    })

    doc.structures.forEach((structure, index) => {
        if (doc.isNew || doc.isNullOrUndefined(structure.costs.fixedCosts.periodCost)) {
            const periodCost = (structure.costs.fixedCosts.monthlyCost / 30) * structure.duration.diff
            doc.structures[index].costs.fixedCosts.periodCost = periodCost
        }
    })
    
    next()
})

module.exports = mongoose.model('Box', boxSchema)