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
        type: {
            name: {
                type: String,
                required: true  
            },
            typeOptions: {
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
                required: true,
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
                    required: true,
                    default: function() {
                        return moment(this.duration.endDate, 'jYYYY-jMM-jDD').diff(moment(this.duration.startDate, 'jYYYY-jMM-jDD'), 'days') + 1
                    }
                }
            },
            types: {
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
                        required: true,
                        default: function() {
                            return Math.ceil(this.types.typeOptions.docSize * this.costs.fixedCosts.squareCost)
                        }
                    },
                    dailyCost: {
                        type: Number,
                        required: true,
                        default: function() {
                            return Math.ceil(this.costs.fixedCosts.monthlyCost / 30)
                        }
                    },
                    periodCost: {
                        type: Number,
                        required: true,
                        default: function() {
                            return Math.ceil((this.costs.fixedCosts.monthlyCost / 30) * (this.duration.diff))
                        }
                    }
                },
                variableCosts: [{
                    name: {
                        type: String,
                        required: true
                    },
                    figures: {
                        periodCost: {
                            type: Number,
                            required: true
                        },
                        monthlyCost: {
                            type: Number,
                            required: true,
                            default: function() {
                                return Math.ceil(this.figures.periodCost / 12)
                            }
                        },
                        dailyCost: {
                            type: Number,
                            required: true,
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
                        return (this.costs.totalMonthlyCost) * (this.duration.diff)
                    }
                }
            },
        }]
    }
,
    {
        timestamps: true
    }
) 

module.exports = mongoose.model('Box', boxSchema)