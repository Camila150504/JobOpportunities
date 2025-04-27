import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Company from './Company.js';

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

Company.hasMany(Job, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

export default Job;
