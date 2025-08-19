const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Listar todas as tarefas
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Filtrar tarefas por status
app.get('/tasks/status/:status', async (req, res) => {
  const { status } = req.params;
  const tasks = await prisma.task.findMany({
    where: { status },
  });
  res.json(tasks);
});

// Buscar tarefa por ID
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(task);
});

// Atualizar tarefa por ID (edição geral)
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { title, description, status },
  });
  res.json(task);
});

// Marcar tarefa como finalizada
app.put('/tasks/:id/finish', async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { status: 'concluída' },
  });
  res.json(task);
});

// Deletar tarefa por ID
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: 'Tarefa deletada' });
});

app.put('/tasks/:id/finish', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status: 'concluída' },
    });
    res.json(task);
  } catch (error) {
    console.error('Erro ao finalizar:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    } else {
      res.status(500).json({ error: 'Erro interno' });
    }
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Tarefa deletada' });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    } else {
      res.status(500).json({ error: 'Erro interno' });
    }
  }
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));