const mongoose = require('mongoose')
const moment = require('moment-jalaali');
const Schema = mongoose.Schema

const boxSchema = new Schema({
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
                required: false
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
                            return Math.ceil(this.marks.markOptions.docSize * this.costs.fixedCosts.squareCost)
                        }
                    },
                    dailyCost: {
                        type: Number,
                        required: false,
                        default: function() {
                            return Math.ceil(this.costs.fixedCosts.monthlyCost / 30)
                        }
                    },
                    periodCost: {
                        type: Number,
                        required: false,
                        default: function() {
                            const diff = this.duration?.diff ?? 0
                            return Math.ceil((this.costs.fixedCosts.monthlyCost / 30)) * diff
                        }
                    },
                },
                variableCosts: [{
                    name: {
                        type: String,
                        required: false
                    },
                    figures: {
                        periodCost: {
                            type: Number,
                            required: false
                        },
                        monthlyCost: {
                            type: Number,
                            required: false,
                            default: function() {
                                return Math.ceil(this.figures.periodCost / 12)
                            }
                        },
                        dailyCost: {
                            type: Number,
                            required: false,
                            default: function() {
                                return Math.ceil(this.figures.periodCost / 365)
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
                        return this.costs.totalMonthlyCost * diff
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




boxSchema.virtual('duration_diff').get(function() {
    return moment(this.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(this.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
})

boxSchema.virtual('structures.structureDurationDiff').get(function() {
    return this.structures.map(structure => {
        return moment(structure.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(structure.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
    })
})

boxSchema.pre('save', function(next) {
    const doc = this
    if (doc.isNew || doc.isNullOrUndefined(doc.duration.diff)) {
        const diff = moment(doc.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(doc.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
        doc.set('duration.diff', diff)
    }
    doc.structures.forEach((structure, index) => {
        if (doc.isNew || doc.isNullOrUndefined(structure.duration.diff)) {
            const diff = moment(structure.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(structure.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
            doc.structures[index].duration.diff = diff
        }
    })
    next()
})

module.exports = mongoose.model('Box', boxSchema)