const Structure = require('../model/Structure')
const Box = require('../model/Box')

async function updateExpiredStructures() {
  try {
    const nowTimestamp = Date.now()
    const expiredBoxes = await Box.find({ 'duration.endDate': { $lt: nowTimestamp } }).lean()
    
    const structureUpdates = expiredBoxes.map(async (box) => {
        const updatedStructures = await Structure.updateMany(
            { parent: box.boxId },
            { $set: { isChosen: false, parent: '' } }
        )
            
      return updatedStructures
    })

    await Promise.all(structureUpdates)
    console.log('Expired structures updated successfully.')
  } catch (error) {
    console.error('An error occurred while updating expired structures:', error)
  }
}

module.exports = { updateExpiredStructures }