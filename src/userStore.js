const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'users.json');

async function readUsers() {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(users, null, 2), 'utf8');
  await fs.rename(temporaryPath, filePath);
}

module.exports = { readUsers, writeUsers };
