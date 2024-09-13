const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Koneksi ke database

const Film = sequelize.define(
  "films",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Film;
