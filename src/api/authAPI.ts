import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  { id: "1", login: "admin", password: "admin123", role: "admin" },
  { id: "2", login: "dev", password: "dev123", role: "developer" },
  { id: "3", login: "ops", password: "ops123", role: "devops" },
];

const SECRET_KEY = "991105";

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;
  const user = users.find((u) => u.login === login && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, user });
  } else {
    res.status(401).json({ message: "Invalid login credentials" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
