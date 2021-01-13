import {GraphQLSchema} from "graphql";
import * as fetch from "node-fetch";

const {Sequelize, DataTypes} = require("sequelize")
const {resolver} = require("graphql-sequelize")

import { join } from 'path';
import {loadSchemaSync} from "@graphql-tools/load"
import {GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import {addResolversToSchema } from '@graphql-tools/schema';

const fs = require("fs")
const path = require("path")

let db = new Sequelize(
    "playerdata",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: false
    }
)

let Player = db.define("playerdata", {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    joined: DataTypes.BIGINT,
    votes: DataTypes.INTEGER,
    donor: DataTypes.BOOLEAN,
    discord: DataTypes.STRING
}, {
    timestamps: false
})

let loadedSchema: GraphQLSchema = loadSchemaSync(join(__dirname, "../schema.graphql"), {
    loaders: [
        new GraphQLFileLoader()
    ]
})

const resolvers = {
    Query: {
        player: resolver(Player),
        players: resolver(Player),
        playername: (obj, {uuid}, context) => {
            return fetch(`https://api.minetools.eu/uuid/${uuid.replace(/-/g, '')}`)
                .then(res => res.json())
                .then(json => json["name"])
        }
    },
    Mutation: {
        createDiscordLinkToken(obj, {uuid}, context){
            console.log(uuid)
            return uuid;
        }
    }
}

export let schema = addResolversToSchema(loadedSchema, resolvers)