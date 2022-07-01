import express from 'express'
import mongoose from 'mongoose'
import appRoutes from './routes.js'
import logger from './utils/logger.js'
import cors from 'cors'
import 'dotenv/config.js'

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const port = process.env.PORT || 4040
const dbUri = process.env.DB_URI

appRoutes(app)

mongoose.connect(`${dbUri}`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    logger.info('Connected to Mongodb')
    app.listen(port, () => {
        logger.info(`Running server at port http://localhost:${port}`)
    })
}).catch((e) => {
    logger.info(`Failed to connect do database: ${e.name}`)
})
