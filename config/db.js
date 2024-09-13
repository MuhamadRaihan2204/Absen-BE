require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

async function checkAndCreateDatabase() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log("Database connected...");

    // Check if database exists
    const [results] = await sequelize.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );

    if (results.length === 0) {
      console.log(`Database ${process.env.DB_NAME} does not exist. Creating...`);

      // Create database if it does not exist
      await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created.`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

checkAndCreateDatabase();

module.exports = sequelize;
