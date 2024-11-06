import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the attributes of the Question model
// Define the attributes of the Question model
export interface QuestionAttributes {
  id: number;
  examId: number; // Foreign key to associate with an exam
  content: string; // The content of the question
  type: 'SPEAKING' | 'LISTENING' | 'READING' | 'WRITING'; // Type of the question (required)
  order: number; // Order of the question in the exam
  createdAt?: Date; // Optional field for creation timestamp
  updatedAt?: Date; // Optional field for update timestamp
}
// Extend the Model class to include the QuestionAttributes
export class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: number;
  public examId!: number;
  public content!: string;
  public type!: 'SPEAKING' | 'LISTENING' | 'READING' | 'WRITING';
  public order!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Define any associations here if needed
}

// Initialize the Question model
export default (sequelize: Sequelize) => {
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      examId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('SPEAKING', 'LISTENING', 'READING', 'WRITING'),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'questions',
      timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
  );

  return Question;
};
