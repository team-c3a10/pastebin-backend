import express from "express";
import cors from "cors";
// import { Client } from "pg";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
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

let pastes = [
  {
    user_id: 1,
    paste_id: 1,
    title: "Bob",
    paste_body: "banana",
    date: "06-09-2021",
  },
  {
    user_id: 2,
    paste_id: 2,
    title: null,
    paste_body: "orange",
    date: "10-05-2021",
  },
  {
    user_id: 1,
    paste_id: 3,
    title: "hello",
    paste_body: "lemon",
    date: "12-09-2021",
  },
];

let users = [
  { id: 1, username: "bob" },
  { id: 2, username: "lily" },
];

// GET /pastes
app.get("/pastes", async (req, res) => {
  const allPastes = pastes;

  res.status(200).json({
    status: "success",
    allPastes,
  });
});

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
    }

    const newPaste = {
      user_id: user_id,
      paste_id: pastes.length + 1,
      title: title,
      paste_body: paste_body,
      date: new Date().toDateString(),
    };
    pastes.push(newPaste);

    return res.status(200).json({
      status: "success",
      newPaste: newPaste,
    });
  }
);

// GET /pastes/user_id
app.get("/pastes/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const isId = users.filter((user) => user.id === user_id);

  if (isId.length !== 0) {
    const pastesByUserId = pastes.filter((paste) => paste.user_id === user_id);

    res.status(200).json({
      status: "success",
      pastesByUserId,
    });
  } else {
    res.status(404).json({
      status: "fail",
      data: {
        id: "Could not find a user with that id.",
      },
    });
  }
});

// GET /users/username
app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const isUsername = users.filter((user) => user.username === username);

  if (isUsername.length !== 0) {
    const userByUsername: User[] = users.filter(
      (user) => user.username === username
    );
    res.status(200).json({
      status: "success",
      user: userByUsername[0],
    });
  } else {
    users.push({ id: users.length + 1, username: username });
    const userByUsername: User[] = users.filter(
      (user) => user.username === username
    );
    res.status(200).json({
      status: "success",
      message: "new user added",
      newUser: userByUsername[0],
    });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
