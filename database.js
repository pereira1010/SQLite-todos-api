const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

db.serialize(() => {
  db.run("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, completed BOOLEAN, priority TEXT)");
  db.run("INSERT INTO todos (task, completed, priority) VALUES ('Learn Node.js', 0, 'medium')");
  db.run("INSERT INTO todos (task, completed, priority) VALUES ('Build a REST API', 0, 'medium')");
});

module.exports = db;