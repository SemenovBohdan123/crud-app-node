import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Не удалось получить пости'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate({
      _id: postId
    }, {
      $inc: { viewsCount: 1 }
    }, {
      returnDocument: 'after'
    }, (err, doc) => {
      if (err) {
        console.log(error);

        return res.status(500).json({
          message: 'Не удалось вернуть посты'
        })
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Пост не найден'
        })
      }

      res.json(doc)
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Не удалось получить пости'
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne({
      _id: postId
    }, {
      title: req.body.title,
      text: req.body.text,
      user: req.body.userId,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
    })

    res.json({
      success: true
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Не удалось обновить пост'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndRemove({
      _id: postId
    }, (err, doc) => {
      if (err) {
        return res.status(500).json({
          message: 'Не удалось удалить пост'
        })
      }

      if (!doc) {
        return res.status(500).json({
          message: 'Не удалось найти пост'
        })
      }

      res.json({
        success: true
      })
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Не удалось получить пост'
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId
    })

    const post = await doc.save()

    res.json(post)
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Не удалось создать пост'
    })
  }
}
