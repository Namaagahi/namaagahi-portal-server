const Package = require('../model/Package')

// const conditions = [
//     req?.body?.boxName,
//     req?.body?.path,
//     req?.body?.address,
//     req?.body?.sysCode,
//     req?.body?.structureType,
//     req?.body?.faceType,
//     req?.body?.district,
//     req?.body?.fee,
//     req?.body?.dimensions,
//     req?.body?.printSize,
//     req?.body?.currentSize,
//     req?.body?.pricePerMeter,
//     req?.body?.buyMonthlyFee,
//     req?.body?.maintenance,
//     req?.body?.monthlyColoring,
//     req?.body?.electrical,
//     req?.body?.sellMonthlyFee,
//     req?.body?.constantDailyFee,
//     req?.body?.startDate,
//     req?.body?.endDay
// ]

// const allConditionsMet = conditions.every(condition => condition)

const getAllPackages = async(req, res) => {
    const package = await Package.find()
    if(!package) return res.status(204).json({ 'msg': 'NO CONTENT: No packages found!' })
    res.json(package)
}

const createNewPackage = async(req, res) => {
    if (
        !req?.body?.boxName ||
        !req?.body?.path ||
        !req?.body?.address ||
        !req?.body?.sysCode ||
        !req?.body?.structureType ||
        !req?.body?.faceType ||
        !req?.body?.district ||
        !req?.body?.fee ||
        !req?.body?.dimensions ||
        !req?.body?.printSize ||
        !req?.body?.currentSize ||
        !req?.body?.pricePerMeter ||
        !req?.body?.buyMonthlyFee ||
        !req?.body?.maintenance ||
        !req?.body?.monthlyColoring ||
        !req?.body?.electrical ||
        !req?.body?.sellMonthlyFee ||
        !req?.body?.constantDailyFee ||
        !req?.body?.startDate ||
        !req?.body?.endDay
        ) return res.status(400).json({ 'msg': 'BAD REQUEST: all fields are required!' })
    try {
        const result = await Package.create({
            boxName: req.body.boxName,
            path: req.body.path,
            address: req.body.address,
            sysCode: req.body.sysCode,
            structureType: req.body.structureType,
            faceType: req.body.faceType,
            district: req.body.district,
            fee: req.body.fee,
            dimensions: req.body.dimensions,
            printSize: req.body.printSize,
            currentSize: req.body.currentSize,
            pricePerMeter: req.body.pricePerMeter,
            buyMonthlyFee: req.body.buyMonthlyFee,
            maintenance: req.body.maintenance,
            monthlyColoring: req.body.monthlyColoring,
            electrical: req.body.electrical,
            sellMonthlyFee: req.body.sellMonthlyFee,
            constantDailyFee: req.body.constantDailyFee,
            startDate: req.body.startDate,
            endDay: req.body.endDay
        })
        
        res.status(201).json({ 'msg': `CREATED: Package ${req.body.boxName} created successfully!`  })
    } catch (error) {
        console.error(error)
    }
}

const editPackage = async(req, res) => {
    if(!req?.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: id parameter is required' })

    const package = await Package.findOne({ _id: req.body.id }).exec()

    if(!package) return res.status(201).json({ 'msg' : `NO CONTENT: No package matches the id: ${req.body.id} ` }) 

    if(req.body?.boxName) package.boxName = req.body.boxName 
    if(req.body?.path) package.path = req.body.path 
    if(req.body?.address) package.address = req.body.address 
    if(req.body?.sysCode) package.sysCode = req.body.sysCode 
    if(req.body?.structureType) package.structureType = req.body.structureType 
    if(req.body?.faceType) package.faceType = req.body.faceType 
    if(req.body?.district) package.district = req.body.district 
    if(req.body?.fee) package.fee = req.body.fee 
    if(req.body?.dimensions) package.dimensions = req.body.dimensions 
    if(req.body?.printSize) package.printSize = req.body.printSize 
    if(req.body?.currentSize) package.currentSize = req.body.currentSize 
    if(req.body?.pricePerMeter) package.pricePerMeter = req.body.pricePerMeter 
    if(req.body?.buyMonthlyFee) package.buyMonthlyFee = req.body.buyMonthlyFee 
    if(req.body?.maintenance) package.maintenance = req.body.maintenance 
    if(req.body?.monthlyColoring) package.monthlyColoring = req.body.monthlyColoring 
    if(req.body?.electrical) package.electrical = req.body.electrical 
    if(req.body?.sellMonthlyFee) package.sellMonthlyFee = req.body.sellMonthlyFee 
    if(req.body?.constantDailyFee) package.constantDailyFee = req.body.constantDailyFee 
    if(req.body?.startDate) package.startDate = req.body.startDate 
    if(req.body?.endDay) package.endDay = req.body.endDay 

    const result = await package.save()
    console.log(result)

    res.status(201).json(result)
}

const deletePackage = async(req, res) => {
    if(!req.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Package id required' })
    const package =  await Package.findOne({ _id: req.body.id }).exec()
    
    if(!package) return res.status(201).json({ 'msg' : `NO CONTENT: No package matches the id: ${req.body.id} ` }) 
    const result = await package.deleteOne({ _id: req.body.id })

    res.status(201).json(result)
}

const getSinglePackage = async(req, res) => {
    if(!req.params?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Package id required' })
    const package = await Package.findOne({ _id: req.params.id }).exec()

    if(!package) return res.status(201).json({ 'msg' : `NO CONTENT: No package matches the id: ${req.params.id} ` }) 

    res.status(201).json(package)
}

module.exports = {
    getAllPackages,
    createNewPackage,
    editPackage,
    deletePackage,
    getSinglePackage,
}
