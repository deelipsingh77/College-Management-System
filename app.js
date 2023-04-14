const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/api/auth', authRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/lnmbcm", {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err))

app.get('/', (req, res)=>{
    res.send('Hello World')
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`Listening of Port ${port}...`);
})