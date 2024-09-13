require('dotenv').config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes/route");
const sequelize = require("./config/db"); // Koneksi ke database
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", routes);

const PORT = process.env.PORT;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
