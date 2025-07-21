const express = require('express')
const router = express.Router()
const isSignedIn = require('../middleware/is-signed-in')
const Games = require('../models/game')

router.get('/new', isSignedIn, (req, res) => {
    res.render('games/new.ejs')
})

router.post('/', isSignedIn, async (req, res) => {
    req.body.user_id = req.session.user._id
    await Games.create(req.body)
    res.redirect('/games')
 
})

router.get('/', async (req, res) => {
    const foundGames = await Games.find()
    res.render('games/index.ejs', { foundGames })
})

router.get('/:gameId', async (req, res) => {
    const foundGame = await Games.findById(req.params.gameId).populate('user_id')
    res.render('games/show.ejs', { foundGame})
})


router.delete('/:gameId', isSignedIn, async (req, res) => {
    await Games.findByIdAndDelete(req.params.gameId);
    res.redirect('/games');
});

module.exports = router