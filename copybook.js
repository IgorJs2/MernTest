const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const Path = require("path");

const app = express()

app.use(express.json({
  extended: true
}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if(process.env.NODE_ENV === 'production'){
  app.use('/', express.static(path.join(__dirname, 'clients', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'clients', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start () {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useUnifiedTopology: true
    })
    app.listen(5000, () => console.log(`[INFO]: App has been started on port ${PORT}...!`))
  } catch (e) {
    console.log(`[INFO]: Server error: ${e}...!`)
    process.exit(1)
  }
}

start()
