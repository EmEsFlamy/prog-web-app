import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const users = [
  { id: '1', login: 'admin', password: 'admin123', role: 'admin' },
  { id: '2', login: 'dev', password: 'dev123', role: 'developer' },
  { id: '3', login: 'ops', password: 'ops123', role: 'devops' },
];

const SECRET_KEY = 'your_jwt_secret_key';
const REFRESH_SECRET_KEY = 'your_refresh_jwt_secret_key';

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);
  
  if (user) {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, refreshToken });
  } else {
    res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
  }
});

app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as { id: string; role: string };
    const token = jwt.sign({ id: decoded.id, role: decoded.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Nieprawidłowy refresh token' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
