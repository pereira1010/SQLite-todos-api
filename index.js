const express = require('express');
const app = express();
const port = 3000;
const db = require('./database');

app.use(express.json());

const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

// GET /todos - Retrieve all to-do items or filter by completed status
app.get('/todos', (req, res) => {
  let { completed } = req.query;
  let query = "SELECT * FROM todos";
  if (completed === 'true' || completed === 'false') {
    query += ` WHERE completed = ${completed === 'true' ? 1 : 0}`;
  }
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const { task, priority } = req.body;
  const query = "INSERT INTO todos (task, completed, priority) VALUES (?, 0, ?)";
  db.run(query, [task, priority || 'medium'], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, task, completed: false, priority: priority || 'medium' });
  });
});

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res, next) => {
  if (req.url.includes("complete-all")) {
    next();
  } else {
    const id = parseInt(req.params.id);
    const { task, completed } = req.body;
    const query = "UPDATE todos SET task = ?, completed = ? WHERE id = ?";
    db.run(query, [task, completed, id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, task, completed });
    });
  }
});

// PUT /todos/complete-all - Mark all to-do items as completed
app.put('/todos/complete-all', (req, res) => {
  const query = "UPDATE todos SET completed = 1";
  db.run(query, [], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).send();
  });
});

// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const query = "DELETE FROM todos WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});