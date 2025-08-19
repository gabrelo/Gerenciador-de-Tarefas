const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient(); // Instancia o PrismaClient

app.use(express.json());
app.use(cors({
  origin: '*' // Permite qualquer origem por enquanto
}));

// Rota raiz para testar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Gerenciador de Tarefas está funcionando!',
    endpoints: {
      'GET /tasks': 'Listar todas as tarefas',
      'POST /tasks': 'Criar nova tarefa',
      'PUT /tasks/:id': 'Atualizar tarefa',
      'PUT /tasks/:id/finish': 'Finalizar tarefa',
      'DELETE /tasks/:id': 'Deletar tarefa'
    }
  });
});

// Listar todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    // Teste de conexão primeiro
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with postgresql:', process.env.DATABASE_URL?.startsWith('postgresql'));
    
    // Comentar temporariamente
    // const tasks = await prisma.task.findMany();
    // res.json(tasks);
    
    // Retorno temporário
    res.json([]);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ error: 'Erro ao listar tarefas', details: error.message });
  }
});

// Criar nova tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !status) {
      return res.status(400).json({ error: 'Título e status são obrigatórios' });
    }
    const task = await prisma.task.create({
      data: { title, description, status },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Tarefa com este título já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  }
});

// Atualizar tarefa (edição geral)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description, status },
    });
    res.json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
  }
});

// Marcar tarefa como concluída
app.put('/tasks/:id/finish', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status: 'concluída' },
    });
    res.json(task);
  } catch (error) {
    console.error('Erro ao finalizar tarefa:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    } else {
      res.status(500).json({ error: 'Erro ao finalizar tarefa' });
    }
  }
});

// Deletar tarefa
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    } else {
      res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
  }
});

// Fechar a conexão com o Prisma ao encerrar o servidor
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001 - 19/08/2025 12:33 PM -03');
});