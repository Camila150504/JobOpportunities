import { DataTypes } from "sequelize";
import conn from "../config/db.js";
import Job from "./Job.js";
import User from "./User.js";

const JobApplicant = conn.define('JobApplicant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Waiting', 'In Process', 'Accepted', 'Rejected'),
        defaultValue: 'Waiting',
        allowNull: false,
    }
}, {
    timestamps: true,
});

User.hasMany(JobApplicant, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
JobApplicant.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(JobApplicant, { foreignKey: 'jobId', onDelete: 'CASCADE', hooks: true });
JobApplicant.belongsTo(Job, { foreignKey: 'jobId' });

export default JobApplicant;
