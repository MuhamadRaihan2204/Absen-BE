const Film = require("../models/film");
const filmSchema = require("../validations/filmValidation");
const sequelize = require("../config/db"); // Koneksi ke database
const fs = require('fs');
const path = require('path');

exports.getFilms = async (req, res) => {
  const { page = 1, limit = 10, lastId } = req.query;
  const pageSize = parseInt(limit, 10);

  const whereClause = lastId ? { id: { [Op.gt]: lastId } } : {};

  try {
    const { count, rows } = await Film.findAndCountAll({
      attributes: ["id", "title", "description", "image_thumbnail"],
      where: whereClause,
      limit: pageSize,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({
      page: parseInt(page, 10),
      limit: pageSize,
      totalPages: totalPages,
      totalUsers: count,
      films: rows,
    });
  } catch (err) {
    console.error("Error fetching films:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFilmById = async (req, res) => {
  try {
    const film = await Film.findByPk(req.params.id, {
      attributes: ["id", "title", "description", "image_thumbnail"],
    });
    if (!film) return res.status(404).json({ error: "film not found" });

    res.status(200).json(film);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createFilm = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { error } = filmSchema.validate(req.body, { abortEarly: false });
    if (error) {
      await transaction.rollback();
      const errorMessages = error.details.reduce((acc, detail) => {
        const field = detail.path[0];
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(detail.message);
        return acc;
      }, {});
      return res.status(400).json({ errors: errorMessages });
    }

    const { title, description } = req.body;
    const image_thumbnail = req.file ? req.file.filename : null;

    const film = await Film.create(
      {
        title,
        description,
        image_thumbnail,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(film);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateFilm = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { error } = filmSchema.validate(req.body, { abortEarly: false });
    if (error) {
      await transaction.rollback();
      const errorMessages = error.details.reduce((acc, detail) => {
        const field = detail.path[0];
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(detail.message);
        return acc;
      }, {});
      return res.status(400).json({ errors: errorMessages });
    }

    const film = await Film.findByPk(req.params.id);
    if (!film) return res.status(404).json({ error: "Film not found" });

    const { title, description } = req.body;
    let image_thumbnail = film.image_thumbnail;

    if (req.file) {
      if (image_thumbnail) {
        fs.unlinkSync(path.join(__dirname, '../storage/videos/', image_thumbnail));
      }
      image_thumbnail = req.file.filename;
    }

    await film.update(
      {
        title,
        description,
        image_thumbnail,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json(film);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteFilm = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const film = await Film.findByPk(req.params.id);
    if (!film) return res.status(404).json({ error: "Film not found" });

    if (film.image_thumbnail) {
      fs.unlinkSync(path.join(__dirname, '../storage/videos/', film.image_thumbnail));
    }

    await film.destroy({ transaction });
    await transaction.commit();
    res.status(204).json("No Content on Success");
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  }
};
