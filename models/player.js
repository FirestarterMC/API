module.exports = (sequelize, DataTypes) => {
    return sequelize.define('playerdata', {
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        joined: DataTypes.BIGINT,
        votes: DataTypes.INTEGER,
        donor: DataTypes.BOOLEAN
    }, {
        timestamps: false
    });
};
