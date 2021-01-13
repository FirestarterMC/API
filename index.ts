import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import {graphqlHTTP} from "express-graphql"
import {schema} from "./models/models"

const app = express()

app.use(cors())
app.use("/", graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(8080)


