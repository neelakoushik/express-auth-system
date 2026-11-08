const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { randomUUID } = require('crypto');
const { readUsers, writeUsers } = require('./userStore');
const { registrationRules, loginRules } = require('./validation');
const authenticateToken = require('./authMiddleware');

const router = express.Router();
const publicUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });

router.post('/register', registrationRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const users = await readUsers();
    const email = req.body.email.toLowerCase();
    if (users.some(user => user.email === email)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const user = {
      id: randomUUID(),
      name: req.body.name,
      email,
      passwordHash: await bcrypt.hash(req.body.password, 12),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    await writeUsers(users);
    return res.status(201).json({ message: 'Registration successful.', user: publicUser(user) });
  } catch (error) { return next(error); }
});

router.post('/login', loginRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const users = await readUsers();
    const user = users.find(item => item.email === req.body.email.toLowerCase());
    const passwordMatches = user && await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordMatches) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    return res.json({ message: 'Login successful.', token, tokenType: 'Bearer', expiresIn: process.env.JWT_EXPIRES_IN || '1h', user: publicUser(user) });
  } catch (error) { return next(error); }
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const users = await readUsers();
    const user = users.find(item => item.id === req.user.sub);
    if (!user) return res.status(404).json({ error: 'User account was not found.' });
    return res.json({ user: publicUser(user) });
  } catch (error) { return next(error); }
});

module.exports = router;
