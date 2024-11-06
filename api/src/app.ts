import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from './models';
import mainRoutes from './routes';

dotenv.config();

const app = express();

// Cấu hình middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Định nghĩa các routes
app.use('/api', mainRoutes);

// Kết nối tới cơ sở dữ liệu và đồng bộ các bảng
db.sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
