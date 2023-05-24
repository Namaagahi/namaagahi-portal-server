const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
const verifyJWT = require('../middleware/virifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

router.route('/:id')
    .get(notesController.getNote);

module.exports = router