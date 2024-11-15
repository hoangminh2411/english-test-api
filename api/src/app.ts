import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from './models';
import mainRoutes from './routes';

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Enable credentials if needed (for cookies, authorization headers, etc.)
};
// Cấu hình middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Định nghĩa các routes
app.use('/api', mainRoutes);

// Kết nối tới cơ sở dữ liệu và đồng bộ các bảng
db.sequelize.sync({ alter: true }).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
