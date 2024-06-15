const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')
const bcrypt = require('bcrypt')

const User = sequelize.define("User",
    {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 30]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        address: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const hashedPassword = bcrypt.hashSync(value,10)
                this.setDataValue('password',hashedPassword)
            },
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        isBanned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                isIn: [[true, false]] //Ensures that the value can only be true or false (1 or 0)
            }
        }, 
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        profileImg: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        }
    },
);

module.exports = User;