import { Dialect, Sequelize } from 'sequelize';
import { development } from '../config/config';
import Exam from './exam';
import Question from './question';
import Answer from './answer';
import Result from './result';
import Document from './document';
import User from './user';

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
    logging: console.log, // Enable logging for debugging
  }
);

const db = {
  sequelize,
  Sequelize,
  Exam: Exam(sequelize),
  Document: Document(sequelize),
  Question: Question(sequelize),
  Answer: Answer(sequelize),
  Result: Result(sequelize),

  User: User(sequelize),
};

// Define associations
// Self-referencing association for Question (parent-child relationship)
db.Question.hasMany(db.Question, { as: 'children', foreignKey: 'parentId' }); // Changed alias to 'children'
db.Question.belongsTo(db.Question, { as: 'parent', foreignKey: 'parentId' }); // Changed alias to 'parent'

// An Exam can have many Questions
db.Exam.hasMany(db.Question, { as: 'questions', foreignKey: 'examId' });
db.Question.belongsTo(db.Exam, { as: 'exam', foreignKey: 'examId' });

// A Question can have many Answers
db.Question.hasMany(db.Answer, { as: 'answers', foreignKey: 'questionId' });
db.Answer.belongsTo(db.Question, { as: 'question', foreignKey: 'questionId' });

// A Question can have one Document (e.g., image or audio)
db.Question.hasOne(db.Document, { as: 'document', foreignKey: 'questionId', onDelete: 'CASCADE' });
db.Document.belongsTo(db.Question, { as: 'question', foreignKey: 'questionId' });

// A Result belongs to an Exam and is linked to a specific User (candidate)
db.Result.belongsTo(db.Exam, { as: 'exam', foreignKey: 'examId' });
db.Result.belongsTo(db.User, { as: 'candidate', foreignKey: 'userId' });
db.Exam.hasMany(db.Result, { as: 'results', foreignKey: 'examId' });
db.User.hasMany(db.Result, { as: 'results', foreignKey: 'userId' });

// A Result is linked to a Question, allowing access to question details (e.g., type)
db.Result.belongsTo(db.Question, { as: 'question', foreignKey: 'questionId' });
db.Question.hasMany(db.Result, { as: 'results', foreignKey: 'questionId' });




export default db;
