require("dotenv").config();
const express = require ('express');

const cors = require('cors'); // cors ()
const app = express();

app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Get all read', completed: true },
  { id: 4, task: 'Update one', completed: true },
];

// GET all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

//GET single todo by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // fixed parseINT typo
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
});

//POST new todo (Create) — with validation
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;

  // Validation: "task" field is required
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task field is required' });
  }

  const newTodo = {
    id: todos.length + 1,
    task,
    completed: completed || false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

//  PATCH (Update one)
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Merge new data
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(200).json({ message: 'Todo deleted successfully' });
});

//  GET completed todos
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

// GET active todos (not completed)
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => !t.completed);
  res.json(activeTodos);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error!' });
});

// Server start
const PORT = process.env.PORT;

app.listen(PORT, () => { 
  console.log(`Server running on Port ${PORT}`)
});
