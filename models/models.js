const {Sequelize, DataTypes} = require("sequelize")
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLFloat,
} = require("graphql")
const {resolver} = require("graphql-sequelize")

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

// GraphQL types
let playerType = new GraphQLObjectType({
    name: "player",
    description: "Represents a player that once joined the network.",
    fields: {
        uuid: {
            type: GraphQLNonNull(GraphQLString),
            description: "The player's Minecraft UUID."
        },
        joined: {
            type: GraphQLNonNull(GraphQLFloat),
            description: "The timestamp of the player's first join."
        },
        donor: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "Whether the player has donated to the server."
        },
        discord: {
            type: GraphQLString,
            description: "The player's Discord user id (if linked)."
        }
    }
})

// GraphQL schema
let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            players: {
                type: GraphQLList(playerType),
                args: {
                    limit: {
                        type: GraphQLInt
                    },
                    order: {
                        type: GraphQLString
                    }
                },
                resolve: resolver(Player)
            },
            player: {
                type: playerType,
                args: {
                    uuid: {
                        type: GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: resolver(Player)
            }
        }
    })
})

module.exports = {
    schema
}