import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ExamAttemptAttributes {
  id: number;
  examId: number;
  userId: number;
  status: 'in_progress' | 'completed' | 'canceled';
  score?: number;
  startedAt?: Date;
  finishedAt?: Date;
}

export type CreateExamAttemptAttributes = Omit<ExamAttemptAttributes, 'id'>;

export class ExamAttempt extends Model<ExamAttemptAttributes> implements ExamAttemptAttributes {
  public id!: number;
  public examId!: number;
  public userId!: number;
  public status!: 'in_progress' | 'completed' | 'canceled';
  public score?: number;
  public startedAt?: Date;
  public finishedAt?: Date;

  public static associate(models: any) {
    ExamAttempt.belongsTo(models.Exam, { as: 'exam', foreignKey: 'examId' });
    ExamAttempt.belongsTo(models.User, { as: 'candidate', foreignKey: 'userId' });
    ExamAttempt.hasMany(models.Result, { as: 'results', foreignKey: 'attemptId' });
  }
}

export default (sequelize: Sequelize) => {
  ExamAttempt.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'canceled'),
        allowNull: false,
        defaultValue: 'in_progress',
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'started_at',
      },
      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'finished_at',
      },
    },
    {
      sequelize,
      tableName: 'exam_attempts',
      timestamps: true,
      underscored: true,
    }
  );

  return ExamAttempt;
};
