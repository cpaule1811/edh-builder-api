const cors = require("cors")
const helmet = require("helmet");
const knex = require('knex');
const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload")
const compression = require('compression')

const app = express()

const signIn = require('./controllers/signin')
const createDeck = require('./controllers/createdeck')
const addCard = require('./controllers/addcard')
const removeCard = require('./controllers/removecard')
const removeDeck = require('./controllers/removedeck')
const editDeck = require('./controllers/editdeck')
const profile = require('./controllers/profile')
const excelDeckList = require('./controllers/exceldecklist')
const username = require('./controllers/username')
const getDeck = require('./controllers/getdeck')
const recentDecks = require('./controllers/mostRecentDecks')
const addRating = require('./controllers/addrating')
const recommended = require('./controllers/recommended')
const leaderboard = require('./controllers/leaderboard')
const auth = require('./controllers/authorization')
const sideboard = require('./controllers/sideboard')
const search = require('./controllers/search')
const commanders = require('./controllers/commanders')
const newSet = require('./controllers/newSet')
const sanitize = require('./controllers/sanitize')
const mail = require('./controllers/mail')
const reset = require('./controllers/updatePassword')
const forgot = require('./controllers/forgotpassword')
const jsonFile = require('./controllers/jsonfile')

const dotenv = require('dotenv');
dotenv.config();

const knexConfig = require('./config/knexConfig.js')[process.env.ENVIRONMENT]

const db = knex({ ...knexConfig })

app.use(fileUpload({
    limits: {fileSize: 3 * 1024 * 1024},
}));
app.use(express.urlencoded({extended: false}));
app.use(helmet())
app.use(express.json({limit: "2mb"}))
app.use(cors({origin: [process.env.ALLOWED_ORIGIN]}))
app.use(compression())

//site data get requests
app.get('/', (req, res) => res.json("hello world"))
app.get('/requestdeck/:id/:userid', auth.requireAuthDecklist, (req, res) => {
    getDeck.handleGetdeck(req, res, db)
})
app.get('/deckspub/:pn/:userid', (req, res) => {
    recentDecks.handleMostRecent(req, res, db)
})
app.get('/deckspriv/:pn/:userid', (req, res) => {
    recentDecks.handleMostRecentPriv(req, res, db)
})
app.get('/decknumpub/:userid', (req, res) => {
    recentDecks.getDecksLength(req, res, db)
})
app.get('/decknumpriv/:userid', (req, res) => {
    recentDecks.getDecksLengthPriv(req, res, db)
})
app.get('/leaderboard', (req, res) => {
    leaderboard.handleLeaderboard(req, res, db)
})

// deck editor requests 
app.post('/addcard', sanitize.sanitizeData, auth.requireAuthEdit(db), (req, res) => {
    addCard.handleAddcard(req, res, db)
})
app.post('/removecard', auth.requireAuthEdit(db), (req, res) => {
    removeCard.handleRemovecard(req, res, db)
})
app.post('/editdeck/:deckID', sanitize.sanitizeData, (req, res) => {
    editDeck.handleEditdeck(req, res, db)
})
app.post('/rating', (req, res) => {
    addRating.handleAddRating(req, res, db)
})
app.put('/sideboard', auth.requireAuthEdit(db), (req, res) => {
    sideboard.handleSideboard(req, res, db)
})
app.get('/search', sanitize.sanitizeData, (req, res) => {
    search.search(req, res, db)
})
app.post('/exceldecklist', auth.requireAuthEdit(db), (req, res) => {
    excelDeckList.handleExceldecklist(req, res, db)
})
app.get('/recommend/:commander/:partner', (req, res) => {
    recommended.handleRecommended(req, res, db)
})

// register/signin requests
app.put('/username', sanitize.sanitizeData, auth.requireAuth, (req, res) => {
    username.handleUsername(req, res, db)
})
app.get('/profile/:userID', auth.requireAuth, (req, res) => {
    profile.handleProfile(req, res, db)
})
app.post('/signin', sanitize.sanitizeData, signIn.signinAuthentication(db, bcrypt))
app.post('/register', sanitize.sanitizeData, signIn.registerAuthentication(db, bcrypt))
app.put('/resetpassword', sanitize.sanitizeData, (req, res) => reset.handleUpdatePassword(req, res, db, bcrypt))
app.post('/forgotpassword', sanitize.sanitizeData, (req, res) => forgot.handleForgot(req, res, db, nodemailer))
app.get('/checkresetvalid', (req, res) => reset.handleValidUnique(req, res))
app.get('/signout', auth.requireAuth, (req, res) => {
    signIn.signout(req, res)
})

// create deck requests
app.post('/createdeck', sanitize.sanitizeData, (req, res) => {
    createDeck.handleCreatedeck(req, res, db)
})
app.get('/commanders', (req, res) => {
    commanders.getCommanders(req, res, db)
})
app.delete('/removedeck/:deckID', (req, res) => {
    removeDeck.handleRemovedeck(req, res, db)
})

// other
app.post('/updateentries', auth.requireAuthAdmin, (req, res) => {
    newSet.updateEntrys(req, res, db)
})
app.post('/jsonentrys', auth.requireAuthAdmin, (req, res) => {
    jsonFile.handleJsonFile(req, res, db)
})
app.post('/send', sanitize.sanitizeData, (req, res) => {
    mail.handleMail(req, res, nodemailer)
})

app.listen(process.env.PORT, () => {
    console.log('listening to server port:' + process.env.PORT)
})