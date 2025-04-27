import { DataTypes} from "sequelize"
import conn from "../config/db.js"
import Company from "./Company.js";

const User = conn.define('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    }, 
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 255],
        },
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 255],
        },
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Email-id required'
          },
          isEmail: {
            args: true,
            msg: 'Valid email-id required'
          }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100],
        },
    },
    role: {
        type: DataTypes.ENUM('employee', 'employer'),
        allowNull: false,
        defaultValue: 'employee',
    },
    companyId:{
      type: DataTypes.INTEGER,
      allowNull: true,
      references:{
        model: "Companies",
        key:"id"
      }
    }, 
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }, 
    profile_picture: { 
      type: DataTypes.STRING, 
      allowNull: true 
    }, 
    cv_file: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
},
{
    tableName: 'users',
    timestamps: true,
})

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

export default User;