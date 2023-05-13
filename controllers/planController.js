const Plan = require('../model/Plan')
const packageController =  require('./packageController')

const getAllPlans = async(req, res) => {
    const thisPlan = await Plan.find()
    if(!thisPlan) return res.status(204).json({ 'msg': 'NO CONTENT: No Plan found!' })
    res.json(thisPlan)
}

const createNewPlan = async(req, res) => {
    const { planNo } = req.body

    if (
        !req?.body?.planNo ||
        !req?.body?.customerName ||
        !req?.body?.brand ||
        !req?.body?.startDate ||
        !req?.body?.endDate ||
        !req?.body?.duration ||
        !req?.body?.sysCode ||
        !req?.body?.address ||
        !req?.body?.printSize ||
        !req?.body?.sellMonthlyFee ||
        !req?.body?.discountPercentage ||
        !req?.body?.sellDaycount ||
        !req?.body?.feeAfterDiscount ||
        !req?.body?.packagePrice ||
        !req?.body?.status
        ) return res.status(400).json({ 'msg': 'BAD REQUEST: all fields are required!' })

        const duplicate = await Plan.findOne({ planNo }).exec()
        if(duplicate) return res.status(409).json({ 'msg': 'CONFLICT: This plan already exists!' })

    try {
        await Plan.create({
            planNo: req.body.planNo,
            customerName: req.body.customerName,
            brand: req.body.brand,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            duration: req.body.duration,
            sysCode: req.body.sysCode,
            address: req.body.address,
            printSize: req.body.printSize,
            sellMonthlyFee: req.body.sellMonthlyFee,
            discountPercentage: req.body.discountPercentage,
            sellDaycount: req.body.sellDaycount,
            feeAfterDiscount: req.body.feeAfterDiscount,
            packagePrice: req.body.packagePrice,
            status: req.body.status,
        })
        
        res.status(201).json({ 'msg': `CREATED: Plan ${req.body.planNo} created successfully!`  })
    } catch (error) {
        console.error(error)
    }
}

const editPlan = async(req, res) => {
    if(!req?.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: id parameter is required' })

    const thisPlan = await Plan.findOne({ _id: req.body.id }).exec()
    if(!thisPlan) return res.status(201).json({ 'msg' : `NO CONTENT: No plan matches the id: ${req.body.id} ` }) 

    if(req.body?.planNo) thisPlan.planNo = req.body.planNo 
    if(req.body?.customerName) thisPlan.customerName = req.body.customerName 
    if(req.body?.brand) thisPlan.brand = req.body.brand 
    if(req.body?.startDate) thisPlan.startDate = req.body.startDate 
    if(req.body?.endDate) thisPlan.endDate = req.body.endDate 
    if(req.body?.duration) thisPlan.duration = req.body.duration 
    if(req.body?.sysCode) thisPlan.sysCode = req.body.sysCode 
    if(req.body?.address) thisPlan.address = req.body.address 
    if(req.body?.printSize) thisPlan.printSize = req.body.printSize 
    if(req.body?.sellMonthlyFee) thisPlan.sellMonthlyFee = req.body.sellMonthlyFee 
    if(req.body?.discountPercentage) thisPlan.discountPercentage = req.body.discountPercentage 
    if(req.body?.sellDaycount) thisPlan.sellDaycount = req.body.sellDaycount 
    if(req.body?.feeAfterDiscount) thisPlan.feeAfterDiscount = req.body.feeAfterDiscount 
    if(req.body?.packagePrice) thisPlan.packagePrice = req.body.packagePrice 
    if(req.body?.status) thisPlan.status = req.body.status 

    const result = await thisPlan.save()
    console.log(result)

    res.status(201).json(result)
}

const deletePlan = async(req, res) => {
    if(!req.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Plan id required' })
    const thisPackage =  await Plan.findOne({ _id: req.body.id }).exec()
    
    if(!thisPackage) return res.status(201).json({ 'msg' : `NO CONTENT: No Plan matches the id: ${req.body.id} ` }) 
    const result = await thisPackage.deleteOne({ _id: req.body.id })

    res.status(201).json(result)
}

const getSinglePlan = async(req, res) => {
    if(!req.params?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Plan id required' })
    const thisPlan = await Plan.findOne({ _id: req.params.id }).exec()

    if(!thisPlan) return res.status(201).json({ 'msg' : `NO CONTENT: No plan matches the id: ${req.params.id} ` }) 

    res.status(201).json(thisPlan)
}

module.exports = {
    getAllPlans,
    createNewPlan,
    editPlan,
    deletePlan,
    getSinglePlan,
}
