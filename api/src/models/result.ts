import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Result extends Model {}

  Result.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    candidateID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    examID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    examinerNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mark: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isTrue: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    recordURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'result',
    timestamps: false,
  });

  return Result;
};
