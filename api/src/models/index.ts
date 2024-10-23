import { Dialect, Sequelize } from 'sequelize';
import { development } from '../config/config';
import Exam from './exam';
import Question from './question';
import Answer from './answer';
import Result from './result';
import Document from './document';
import User from './user';
import { isNull } from 'util';
import exam from './exam';

const sequelize = new Sequelize(
  development.database || 'default_database_name',
  development.username || 'default_username',
  undefined,
  {
    host: development.host || 'localhost',
    dialect: process.env.DB_DIALECT as Dialect || 'mysql',
    port: development.port,
    database: 'english_exam_db',
    schema: 'english_exam_db',
  }
);

const db = {
  sequelize,
  Sequelize,
  Exam: Exam(sequelize),
  Question: Question(sequelize),
  Answer: Answer(sequelize),
  Result: Result(sequelize),
  Document: Document(sequelize),
  User: User(sequelize),
};

// Associations
db.Exam.hasMany(db.Question, { as: 'questions', foreignKey: 'examId' });
db.Question.hasMany(db.Answer, { as: 'answers', foreignKey: 'questionId' });
db.Result.belongsTo(db.User, { as: 'candidate', foreignKey: 'candidateID' });
db.Result.belongsTo(db.Exam, { as: 'exam', foreignKey: 'examID' });
db.Result.belongsTo(db.Question, { as: 'question', foreignKey: 'questionID' });

export default db;
