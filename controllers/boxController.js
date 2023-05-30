const Box = require('../model/Box')

const getAllBoxes = async(req, res) => {
    const allBoxes = await Box.find()
    if(!allBoxes) return res.status(204).json({ 'msg': 'NO CONTENT: No boxes found!' })
    res.json(allBoxes)
}

const createNewBox = async(req, res) => {
    const { boxName } = req.body

    const boxObject = {
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

    const isValidated = Object.values(boxObject).every((value) => value)

    if (!isValidated) return res.status(400)
        .json({ 'msg': 'BAD REQUEST: all fields are required!' })

    const duplicate = await Box.findOne({ boxName }).exec()
    if (duplicate) return res.status(409)
        .json({ 'msg': 'CONFLICT: This box already exists!' })

    try {
        await Box.create(boxObject)
        res.status(201)
            .json({ 'msg': `CREATED: Box ${req.body.boxName} created successfully!` })
    } catch (error) {
        throw new Error(error)
    }
}

const editBox = async(req, res) => {
    if (!req?.body?.id) return res.status(400)
        .json({ 'msg': 'BAD REQUEST: id parameter is required' })

    const thisBox = await Box.findOne({ _id: req.body.id }).exec()
    console.log(thisBox)

    if (!thisBox) return res.status(401)
        .json({ 'msg': `NO CONTENT: No box matches the id: ${req.body.id} ` }) 

    if(req.body?.boxName) thisBox.boxName = req.body.boxName 
    if(req.body?.path) thisBox.path = req.body.path 
    if(req.body?.address) thisBox.address = req.body.address 
    if(req.body?.sysCode) thisBox.sysCode = req.body.sysCode 
    if(req.body?.structureType) thisBox.structureType = req.body.structureType 
    if(req.body?.faceType) thisBox.faceType = req.body.faceType 
    if(req.body?.district) thisBox.district = req.body.district 
    if(req.body?.fee) thisBox.fee = req.body.fee 
    if(req.body?.dimensions) thisBox.dimensions = req.body.dimensions 
    if(req.body?.printSize) thisBox.printSize = req.body.printSize 
    if(req.body?.currentSize) thisBox.currentSize = req.body.currentSize 
    if(req.body?.pricePerMeter) thisBox.pricePerMeter = req.body.pricePerMeter 
    if(req.body?.buyMonthlyFee) thisBox.buyMonthlyFee = req.body.buyMonthlyFee 
    if(req.body?.maintenance) thisBox.maintenance = req.body.maintenance 
    if(req.body?.monthlyColoring) thisBox.monthlyColoring = req.body.monthlyColoring 
    if(req.body?.electrical) thisBox.electrical = req.body.electrical 
    if(req.body?.finalCost) thisBox.finalCost = req.body.finalCost 
    if(req.body?.sellMonthlyFee) thisBox.sellMonthlyFee = req.body.sellMonthlyFee 
    if(req.body?.constantDailyFee) thisBox.constantDailyFee = req.body.constantDailyFee 
    if(req.body?.startDate) thisBox.startDate = req.body.startDate 
    if(req.body?.endDay) thisBox.endDay = req.body.endDay 

    const result = await thisBox.save()
    res.status(200).json(result)
}

const deleteBox = async(req, res) => {
    if(!req.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Box id required' })
    const thisBox =  await Box.findOne({ _id: req.body.id }).exec()
    
    if(!thisBox) return res.status(201).json({ 'msg' : `NO CONTENT: No box matches the id: ${req.body.id} ` }) 
    const result = await thisBox.deleteOne({ _id: req.body.id })

    res.status(201).json(result)
}

const getSingleBox = async(req, res) => {
    if(!req.params?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Box id required' })
    const thisBox = await Box.findOne({ _id: req.params.id }).exec()

    if(!thisBox) return res.status(201).json({ 'msg' : `NO CONTENT: No box matches the id: ${req.params.id} ` }) 

    res.status(201).json(thisBox)
}

module.exports = {
     getAllBoxes,
     createNewBox,
     editBox,
     deleteBox,
     getSingleBox,
}