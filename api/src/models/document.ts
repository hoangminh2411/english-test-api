import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Document extends Model {}

  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM('IMAGE', 'AUDIO'),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON, // Stores any additional information about the document
      },
    },
    {
      sequelize,
      tableName: 'documents',
      timestamps: false,
    }
  );

  return Document;
};
