import updateRoutes from "./routes/update.js"
import readRoutes from "./routes/read.js"
import postRoutes from "./routes/post.js"

export default function appRoutes(app){
    readRoutes(app)
    postRoutes(app)
    updateRoutes(app)
}