import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import appRoutes from './routes.js'
import 'dotenv/config.js'

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

const port = process.env.PORT || 4040
const dbUri = process.env.DB_URI

appRoutes(app)

mongoose.connect(`${dbUri}`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to Mongodb')
    app.listen(port, () => {
        console.log(`Running server at port http://localhost:${port}`)
    })
}).catch((e) => {
    console.log(`Failed to connect do database: ${e.name}`)
})
