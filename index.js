import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer';

import { handleValidationErrors, checkAuth } from './utils/index.js'

import { loginValidation, registerValidation, postCreateValidation } from './validations/validations.js'

import { PostController, UserController } from './controllers/index.js'

mongoose.connect('mongodb+srv://bogonutui:bogonutui@cluster0.bgs2vfm.mongodb.net/blog?retryWrites=true&w=majority').then(() => {
  console.log('DB ok');
})
  .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file?.originalname}`
  })
})

app.get('/posts', PostController.getAll)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.get('/posts/:id', PostController.getOne)
app.patch('/posts/:id', checkAuth, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server OK');
})
