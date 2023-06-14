// box.costs
const boxMaintenanceCostsObj = {
    maintenanceCosts: [{
        name: {
            type: String,
            required: true
        },
        service: {
            type: String,
            required: true
        },
        dateCosts: [{
            startDate: {
                type: String,
                required: true,
                default: function() {
                    return this.parent().parent().duration.startDate
                }
            },
            endDate: {
                type: String,
                required: true,
                default: function() {
                    return this.parent().parent().duration.endDate
                }
            },
            diff: {
                type: Number,
                required: true,
                default: function() {
                    return moment(
                        this.endDate,
                            'jYYYY-jMM-jDD').diff(moment(
                            this.startDate,
                                'jYYYY-jMM-jDD'), 'days') + 1
                }
            },
            costPerDay: {
                
            }
        }]
    }]
}