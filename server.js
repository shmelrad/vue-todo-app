import express from 'express';
import { createServer } from 'vite';
import db from './db.js';
import { getListById } from './db.js'
import { randomUUID } from 'crypto'
const app = express();

app.use(express.json())
app.use(express.static('dist'));

app.get('/api/lists', (req, res) => {
  const list = db.data.lists;

  res.json(list);
});


app.post('/api/lists', async (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(400).send('name was not provided')
  }
  const newList = { id: getRandomId(), name, todos: [] };
  db.data.lists.push(newList)
  await db.write()

  res.json(newList)
});

app.delete('/api/lists', async (req, res) => {
  const { listId } = req.body;

  if (!listId) {
    res.status(400).send("listId was not provided")
    return
  }

  db.data.lists = db.data.lists.filter(list => list.id !== listId);
  await db.write()

  res.sendStatus(200)
});

app.post('/api/addTodoToList', async (req, res) => {
  const { listId, todo, newIndex } = req.body;
  if (!listId || !todo) {
    res.status(400).send("listId or todo was not provided")
    return
  }

  const list = getListById(listId)
  if (!list) {
    res.status(404).send("list not found")
    return
  }
  if (newIndex) {
    list.todos.splice(newIndex, 0, todo)
    await db.write()

    res.sendStatus(200)
    return
  } else {
    const newTodo = { id: getRandomId(), labels: [], tasks: [], ...todo }
    list.todos.push(newTodo)
    await db.write()

    res.json(newTodo)
    return
  }
});

app.post('/api/updateTodo', async (req, res) => {
  const { listId, todo } = req.body;
  if (!listId || !todo || !todo.id) {
    res.status(400).send("listId, todo or todo.id was not provided")
    return
  }

  const list = getListById(listId)
  if (!list) {
    res.status(404).send("list not found")
    return
  }
  const todoIndex = list.todos.findIndex(t => t.id === todo.id)
  list.todos.splice(todoIndex, 1, todo)
  await db.write()

  res.sendStatus(200)
});

app.post('/api/changeListHeader', async (req, res) => {
  const { listId, newHeader } = req.body;
  if (!listId || !newHeader) {
    res.status(400).send("listId or newHeader was not provided")
    return
  }

  const list = getListById(listId)
  if (!list) {
    res.status(404).send("list not found")
    return
  }
  list.name = newHeader
  await db.write()

  res.sendStatus(200)
  return
});

app.post('/api/moveTodo', async (req, res) => {
  const { oldIndex, newIndex, listId } = req.body;
  if (oldIndex === undefined || newIndex === undefined || !listId) {
    res.status(400).send("oldIndex, newIndex or listId was not provided")
    return
  }

  const list = getListById(listId)
  if (!list) {
    res.status(404).send("list not found")
    return
  }

  if (!(0 <= oldIndex && oldIndex < list.todos.length) || !(0 <= newIndex && newIndex < list.todos.length)) {
    res.status(400).send("wrong indexes")
  }
  [list.todos[oldIndex], list.todos[newIndex]] = [list.todos[newIndex], list.todos[oldIndex]]
  await db.write()

  res.sendStatus(200)
});

app.delete('/api/removeTodoByIndex', async (req, res) => {
  const { index, listId } = req.body;
  if (index === undefined || !listId) {
    res.status(400).send("index or listId was not provided")
    return
  }

  const list = getListById(listId)
  if (!list) {
    res.status(404).send("list not found")
    return
  }

  if (!(0 <= index && index < list.todos.length)) {
    res.status(400).send("wrong index")
  }

  list.todos.splice(index, 1)
  await db.write()

  res.sendStatus(200)
});

app.delete('/api/removeTodoById', async (req, res) => {
  const { todoId, listId } = req.body;
  if (!todoId || !listId) {
    res.status(400).send("todoId or listId was not provided")
    return
  }

  const list = getListById(listId)
  if (!list) {
    res.status(404).send("list not found")
    return
  }

  list.todos = list.todos.filter(t => t.id !== todoId)
  await db.write()

  res.sendStatus(200)
});

app.get('/api/getLabels', async (req, res) => {
  res.json(db.data.labels)
});


app.post('/api/addLabel', async (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    res.status(400).send("name or color was not provided")
    return
  }

  const newLabel = {id: getRandomId(), name, color}
  db.data.labels.push(newLabel)
  await db.write()

  res.json(newLabel)
});

app.delete('/api/removeLabel', async (req, res) => {
  const { labelId } = req.body;
  if (!labelId) {
    res.status(400).send("labelId was not provided")
    return
  }

  db.data.labels = db.data.labels.filter(l => l.id !== labelId)
  for (let list of db.data.lists){
    for (let item of list.todos) {
        if (!item.labels){
          continue
        }

        item.labels = item.labels.filter(l => l.id !== labelId)
    }
  }
  await db.write()

  res.sendStatus(200)
});

(async () => {
  const viteDevServer = await createServer({
    server: { middlewareMode: true }
  });

  app.use(viteDevServer.middlewares);

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
})();

function getRandomId() {
  return randomUUID()
}

