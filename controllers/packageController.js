const Package = require('../model/Package')

const getAllPackages = async(req, res) => {
    const allPackages = await Package.find()
    if(!allPackages) return res.status(204).json({ 'msg': 'NO CONTENT: No packages found!' })
    res.json(allPackages)
}

const createNewPackage = async(req, res) => {
    const { boxName } = req.body

    const packageObject = {
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
        finalCost: req.body.finalCost,
        sellMonthlyFee: req.body.sellMonthlyFee,
        constantDailyFee: req.body.constantDailyFee,
        startDate: req.body.startDate,
        endDay: req.body.endDay
    }

    const isValidated = Object.values(packageObject).every((value) => value)

    if (!isValidated) return res.status(400)
        .json({ 'msg': 'BAD REQUEST: all fields are required!' })

    const duplicate = await Package.findOne({ boxName }).exec()
    if (duplicate) return res.status(409)
        .json({ 'msg': 'CONFLICT: This package already exists!' })

    try {
        await Package.create(packageObject)
        res.status(201)
            .json({ 'msg': `CREATED: Package ${req.body.boxName} created successfully!` })
    } catch (error) {
        throw new Error(error)
    }
}

const editPackage = async(req, res) => {
    if (!req?.body?.id) return res.status(400)
        .json({ 'msg': 'BAD REQUEST: id parameter is required' })

    const thisPackage = await Package.findOne({ _id: req.body.id }).exec()
    console.log(thisPackage)

    if (!thisPackage) return res.status(401)
        .json({ 'msg': `NO CONTENT: No package matches the id: ${req.body.id} ` }) 

    if(req.body?.boxName) thisPackage.boxName = req.body.boxName 
    if(req.body?.path) thisPackage.path = req.body.path 
    if(req.body?.address) thisPackage.address = req.body.address 
    if(req.body?.sysCode) thisPackage.sysCode = req.body.sysCode 
    if(req.body?.structureType) thisPackage.structureType = req.body.structureType 
    if(req.body?.faceType) thisPackage.faceType = req.body.faceType 
    if(req.body?.district) thisPackage.district = req.body.district 
    if(req.body?.fee) thisPackage.fee = req.body.fee 
    if(req.body?.dimensions) thisPackage.dimensions = req.body.dimensions 
    if(req.body?.printSize) thisPackage.printSize = req.body.printSize 
    if(req.body?.currentSize) thisPackage.currentSize = req.body.currentSize 
    if(req.body?.pricePerMeter) thisPackage.pricePerMeter = req.body.pricePerMeter 
    if(req.body?.buyMonthlyFee) thisPackage.buyMonthlyFee = req.body.buyMonthlyFee 
    if(req.body?.maintenance) thisPackage.maintenance = req.body.maintenance 
    if(req.body?.monthlyColoring) thisPackage.monthlyColoring = req.body.monthlyColoring 
    if(req.body?.electrical) thisPackage.electrical = req.body.electrical 
    if(req.body?.finalCost) thisPackage.finalCost = req.body.finalCost 
    if(req.body?.sellMonthlyFee) thisPackage.sellMonthlyFee = req.body.sellMonthlyFee 
    if(req.body?.constantDailyFee) thisPackage.constantDailyFee = req.body.constantDailyFee 
    if(req.body?.startDate) thisPackage.startDate = req.body.startDate 
    if(req.body?.endDay) thisPackage.endDay = req.body.endDay 

    const result = await thisPackage.save()
    res.status(200).json(result)
}

const deletePackage = async(req, res) => {
    if(!req.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Package id required' })
    const thisPackage =  await Package.findOne({ _id: req.body.id }).exec()
    
    if(!thisPackage) return res.status(201).json({ 'msg' : `NO CONTENT: No package matches the id: ${req.body.id} ` }) 
    const result = await thisPackage.deleteOne({ _id: req.body.id })

    res.status(201).json(result)
}

const getSinglePackage = async(req, res) => {
    if(!req.params?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Package id required' })
    const thisPackage = await Package.findOne({ _id: req.params.id }).exec()

    if(!thisPackage) return res.status(201).json({ 'msg' : `NO CONTENT: No package matches the id: ${req.params.id} ` }) 

    res.status(201).json(thisPackage)
}

module.exports = {
    getAllPackages,
    createNewPackage,
    editPackage,
    deletePackage,
    getSinglePackage,
}