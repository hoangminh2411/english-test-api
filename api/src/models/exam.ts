import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Exam extends Model {}

  Exam.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    examNote: DataTypes.STRING,
    type: DataTypes.INTEGER,
    question: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    result: DataTypes.INTEGER,
    file: DataTypes.STRING,
    order: DataTypes.INTEGER,
    part: DataTypes.INTEGER,
    limiTime: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'exam',
    timestamps: false,
  });

  return Exam;
};
