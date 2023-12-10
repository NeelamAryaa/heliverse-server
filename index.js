const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/users");
const Team = require("./models/teams");
const port = 5000;

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://heliverse-frontend-v2.onrender.com",
    // origin: "*",
  })
);

mongoose
  .connect(
    // "mongodb+srv://root:root@cluster0.ckxjsla.mongodb.net/?retryWrites=true&w=majority"
    "mongodb+srv://null0990null:root@cluster0.yyczadt.mongodb.net/"
  )
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));

//   apis

app.post("/api/users", async (req, response) => {
  console.log(req.body);
  //   const user = new User(request.body);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    gender: req.body.gender,
    domain: req.body.domain,
    avatar: req.body.avatar,
    available: req.body.available,
  });

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/api/users", async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  try {
    const totalUsers = await User.countDocuments();
    const paginatedUsers = await User.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

    res.json({
      users: paginatedUsers,
      page: pageNumber,
      limit: limitNumber,
      totalUsers: totalUsers,
    });
  } catch (error) {
    console.error("Error retrieving users from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId).exec();

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user in MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/filter-users", async (req, res) => {
  const { domain, gender, available } = req.query;
  let filter = {};

  if (domain) {
    filter.domain = domain;
  }

  if (gender) {
    filter.gender = gender;
  }

  if (available !== undefined) {
    filter.available = available.toLowerCase() === "true";
  }

  try {
    const filteredUsers = await User.find(filter);
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/search-user", async (req, res) => {
  const { name } = req.query;
  let filter = {};

  if (name) {
    filter.first_name = name;
  }

  try {
    const filteredUsers = await User.find({
      first_name: { $regex: `^${name}`, $options: "i" },
    });
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// create team
app.post("/api/team", async (req, res) => {
  const { team, teamName } = req.body;

  try {
    if (!teamName) {
      return res.status(400).json({ error: "Team name is required." });
    }

    if (!team || !Array.isArray(team) || team.length === 0) {
      return res
        .status(400)
        .json({ error: "Users array is required and should not be empty." });
    }

    const uniqueDomains = [...new Set(team.map((t) => t.domain))];

    const Availability = team.every((element) => element.available === true);

    if (uniqueDomains.length !== team.length || !Availability) {
      return res.status(400).json({
        error: "Selected users must have unique domains and availability.",
      });
    }

    const newTeam = new Team({
      team_name: teamName,
      selected_user: team,
    });

    await newTeam.save();

    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/team/:id", async (req, res) => {
  const teamId = req.params.id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
