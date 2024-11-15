import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ResultAttributes {
  id: number;
  attemptId: number; // New foreign key
  questionId: number;
  selectedAnswer: string;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
}

export type CreateResultAttributes = Omit<ResultAttributes, 'id'>;

export class Result extends Model<ResultAttributes> implements ResultAttributes {
  public id!: number;
  public attemptId!: number; // Updated
  public questionId!: number;
  public selectedAnswer!: string;
  public isCorrect?: boolean;
  public score?: number;
  public feedback?: string;

  public static associate(models: any) {
    Result.belongsTo(models.ExamAttempt, { as: 'attempt', foreignKey: 'attemptId' });
    Result.belongsTo(models.Question, { as: 'question', foreignKey: 'questionId' });
  }
}

export default (sequelize: Sequelize) => {
  Result.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      attemptId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'attempt_id',
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'question_id',
      },
      selectedAnswer: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'selected_answer',
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'is_correct',
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
      underscored: true,
    }
  );

  return Result;
};
