import express from "express";
import cors from "cors";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectToHeroku = process.env.NODE_ENV === "production";

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: connectToHeroku
    ? {
        rejectUnauthorized: false,
      }
    : false,
};
console.log({ config, connectToHeroku, nodeEnv: process.env.NODE_ENV });

const client = new Client(config);

const databaseConnection = async () => {
  await client.connect();
  console.log("Connected to pastes db!");
};
databaseConnection();

const app = express();
app.use(express.json());
app.use(cors());
const PORT_NUMBER = process.env.PORT ?? 4000;

interface User {
  id: number;
  username: string;
}

interface Paste {
  user_id: number;
  paste_id: number;
  title: string | undefined | null;
  paste_body: string;
  date: string;
}

// POST /pastes/:user_id
app.post<{ user_id: string }, {}, Partial<Paste>>(
  "/pastes/:user_id",
  async (req, res) => {
    const user_id = parseInt(req.params.user_id);
    const { title, paste_body } = req.body;

    if (paste_body === "") {
      res.status(400).json({
        status: "fail",
        data: {
          name: "You must provide some paste body for your paste.",
        },
      });
    } else {
      const values = [user_id, title, paste_body];
      const posted = await client.query(
        "INSERT INTO pastes(user_id, title, paste_body) VALUES($1, $2, $3) RETURNING *",
        values
      );
      res.status(200).json({
        status: "success",
        data: {
          posted,
        },
      });
    }
  }
);

// GET /pastes
app.get("/pastes", async (req, res) => {
  const getAllPastes = await client.query("SELECT * FROM pastes");
  const userPastes = getAllPastes.rows;
  res.status(200).json({
    status: "success",
    data: {
      userPastes,
    },
  });
});

// GET /pastes/user_id
app.get("/pastes/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const getUserPastes = await client.query(
    "SELECT * FROM pastes WHERE user_id = $1 ORDER BY date DESC LIMIT 10",
    [userId]
  );

  if (getUserPastes.rows.length >= 1) {
    const userPastes = getUserPastes.rows;
    res.status(200).json({
      status: "success",
      data: {
        userPastes,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: {
        id: "Could not find a paste with that id identifier",
      },
    });
  }
});

// GET /users/username
app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const checkUsers = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (checkUsers.rows.length === 1) {
    res.status(200).json({
      status: "success",
      message: "logged user in",
      user: checkUsers.rows[0],
    });
  } else {
    const signUp = await client.query(
      "INSERT INTO users (username) VALUES($1) RETURNING *",
      [username]
    );
    res.status(200).json({
      status: "success",
      message: "new user added",
      user: signUp.rows[0],
    });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
