// models/question.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the attributes of the Question model
export interface QuestionAttributes {
  [x: string]: any;
  id: number;
  examId: number;
  content: string;
  type: 'SPEAKING' | 'LISTENING' | 'READING' | 'WRITING';
  order: number;
  parentId?: number;
  documentId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export type CreateQuestionAttributes = Omit<QuestionAttributes, 'id' | 'createdAt' | 'updatedAt'>;
// Extend the Model class to include the QuestionAttributes
export class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: number;
  public examId!: number;
  public content!: string;
  public type!: 'SPEAKING' | 'LISTENING' | 'READING' | 'WRITING';
  public order!: number;
  public parentId?: number;
  public documentId?: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Define any associations here if needed
  public static associate() {
    // Self-association for parent-child relationship
    Question.hasMany(Question, { as: 'subQuestions', foreignKey: 'parentId' });
    Question.belongsTo(Question, { as: 'parentQuestion', foreignKey: 'parentId' });
  }
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
        field: 'exam_id',
      },
      content: {
        type: DataTypes.TEXT,
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
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_id',
      },
      documentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'SET NULL', // Khi xóa Document, documentId trong Question sẽ được set null
        onUpdate: 'CASCADE',
        field: 'document_id',
      },
    },
    {
      sequelize,
      tableName: 'questions',
      timestamps: true,
      underscored: true, // Use snake_case for this model
    }
  );

  // Call the association method to set up self-reference
  Question.associate();

  return Question;
};
