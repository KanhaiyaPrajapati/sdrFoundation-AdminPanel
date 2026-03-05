const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// In‑memory user storage
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // plain text for demo only!
    role: 'admin'
  }
];

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // allow both ports
  credentials: true
}));
app.use(bodyParser.json());

// Helper: generate a fake token (base64 of user info)
const generateToken = (user) => {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');
};

// REGISTER endpoint
app.post('/api/admins/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role
  };
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  const token = generateToken(newUser);
  res.status(201).json({ token, user: userWithoutPassword });
});

// LOGIN endpoint
app.post('/api/admins/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(user);
  res.json({ token, user: userWithoutPassword });
});

// GET all admins (optional)
app.get('/api/admins', (req, res) => {
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.json(safeUsers);
});

app.listen(PORT, () => {
  console.log(`✅ Mock backend running at http://localhost:${PORT}`);
});


