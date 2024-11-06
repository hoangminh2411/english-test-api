import { DataTypes, Model, Sequelize } from 'sequelize';


// Define the attributes of the Result model
export interface ResultAttributes {
  id: number;
  userId: number;
  examId: number;
  questionId: number; // Include questionId for association
  selectedAnswer: string;
  isCorrect?: boolean | null;
  score?: number;
  feedback?: string;
}
export type CreateResultAttributes = Omit<ResultAttributes, 'id' | 'createdAt' | 'updatedAt'>;
// Extend the Model class to include the ResultAttributes
export class Result extends Model<ResultAttributes> implements ResultAttributes {
  public id!: number;
  public userId!: number;
  public examId!: number;
  public questionId!: number;
  public selectedAnswer!: string;
  public isCorrect?: boolean;
  public score?: number;
  public feedback?: string;

  public static associate(models: any) {
    Result.belongsTo(models.Question, { as: 'question', foreignKey: 'questionId' });
    Result.belongsTo(models.User, { as: 'candidate', foreignKey: 'userId' });
    Result.belongsTo(models.Exam, { as: 'exam', foreignKey: 'examId' });
  }
}

// Initialize the Result model
export default (sequelize: Sequelize) => {
  Result.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      examId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      selectedAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'results',
      timestamps: true,
    }
  );

  return Result;
};
