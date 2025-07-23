const upload = require('../config/multer')
const cloudinary = require('../config/cloudinary')
const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Games = require('../models/game')
const uploadImage = require('../middleware/handle-upload')

router.get('/new', isSignedIn, (req, res) => {
    const error = req.query.error || null
    res.render('games/new.ejs', { error })
})


router.post('/', isSignedIn, uploadImage, async (req, res) => {
    if(req.fileUploadError){
        console.log(req.fileUploadError)
        res.redirect('/games/new?error=unsupported')
    }

    req.body.user_id = req.session.user._id

      if (req.file) {
            req.body.image = {
                url: req.file.path,
                cloudinary_id: req.file.filename
            };
        }
    await Games.create(req.body)
    res.redirect('/games')
 
})

router.get('/', async (req, res) => {
  const foundGames = await Games.find({ user_id: req.session.user._id }).sort({ title: 1 });
    res.render('games/index.ejs', { foundGames, user: req.session.user });
})

router.get('/:gameId', async (req, res) => {
    const foundGame = await Games.findById(req.params.gameId).populate('user_id')
    res.render('games/show.ejs', { foundGame})
})


router.delete('/:gameId', isSignedIn, async (req, res) => {
    const foundGame = await Games.findById(req.params.gameId);
    if (foundGame.image?.cloudinary_id) {
        await cloudinary.uploader.destroy(foundGame.image.cloudinary_id)
    }
    await foundGame.deleteOne()
    await Games.findByIdAndDelete(req.params.gameId);
    res.redirect('/games');
});

router.get('/:gameId/edit', isSignedIn, async (req, res) => {
    const foundGame = await Games.findById(req.params.gameId).populate('user_id')
    res.render('games/edit.ejs', { foundGame })
})

router.put('/:gameId', isSignedIn, upload.single('image'),  async (req, res) => {
    const foundGame = await Games.findById(req.params.gameId).populate('user_id')
    if (req.file && foundGame.image?.cloudinary_id) {
        await cloudinary.uploader.destroy(foundGame.image.cloudinary_id)
        foundGame.image.url = req.file.path
        foundGame.image.cloudinary_id = req.file.filename
    }

    foundGame.title = req.body.title
    foundGame.platform = req.body.platform
    foundGame.paid = req.body.paid
    foundGame.status = req.body.status

    await foundGame.save()

    await Games.findByIdAndUpdate(req.params.gameId, req.body, { new: true })
    res.redirect(`/games/${req.params.gameId}`)
})

module.exports = router