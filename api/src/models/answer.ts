import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Answer extends Model {}

  Answer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isCorrectAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdUser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  }, {
    sequelize,
    tableName: 'answer',
    timestamps: false,
  });

  return Answer;
};
