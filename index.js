require('dotenv').config()
const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const {schema} = require("./models/models")

const app = express()
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(8080)


