import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const development = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'english_exam_db',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  dialect: 'mysql' as Dialect,
};