import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Exam extends Model {}

  Exam.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
      },
      totalTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_time',
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'created_by',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'exams',
      timestamps: false,
      underscored: true, // Use snake_case for this model
    }
  );

  return Exam;
};
