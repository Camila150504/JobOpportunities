import { Sequelize } from "sequelize"
import dotenv from 'dotenv'
dotenv.config()

const conn = new Sequelize({
    host: process.env.MYSQL_HOST, 
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DB,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, 
    dialect: "mysql"
})

export default conn;