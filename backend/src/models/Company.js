import { DataTypes} from "sequelize"
import conn from "../config/db.js"

const Company = conn.define('Company',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }, 
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Company