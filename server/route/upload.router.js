//#3 00:59:00
import { Router } from 'express'
import auth from '../middleware/auth.js'
import uploadImageController from '../controllers/uploadImage.controller.js'
import upload from '../middleware/multer.js'

const uploadRouter = Router()
//auth means for only loggedin users
uploadRouter.post("/upload",auth,upload.single("image"),uploadImageController)

export default uploadRouter