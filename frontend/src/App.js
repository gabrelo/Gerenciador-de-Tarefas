import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pendente' });
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/tasks')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Erro ao carregar tarefas: ' + (error.response?.data || error.message));
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', status: 'pendente' });
      })
      .catch(error => setError('Erro ao criar tarefa: ' + (error.response?.data || error.message)));
  };

  const handleFinish = (id) => {
    console.log(`Finalizando tarefa com id: ${id}`);
    axios.put(`http://localhost:3001/tasks/${id}/finish`)
      .then(response => {
        setTasks(tasks.map(task => task.id === id ? response.data : task));
      })
      .catch(error => setError('Erro ao finalizar tarefa: ' + error.message));
  };

  const handleDelete = (id) => {
    console.log(`Deletando tarefa com id: ${id}`);
    axios.delete(`http://localhost:3001/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => setError('Erro ao deletar: ' + error.message));
  };

  const handleEdit = (task) => {
    setEditTask({ ...task, title: task.title || '', description: task.description || '', status: task.status || 'pendente' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    console.log('Salvando tarefa com ID:', editTask.id, 'Dados:', editTask);
    axios.put(`http://localhost:3001/tasks/${editTask.id}`, editTask)
      .then(response => {
        setTasks(tasks.map(task => task.id === editTask.id ? response.data : task));
        setEditTask(null);
      })
      .catch(error => setError('Erro ao editar: ' + (error.response?.data || error.message)));
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <h1>Gerenciador de Tarefas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Título"
          required
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Descrição"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="pendente">Pendente</option>
          <option value="em progresso">Em Progresso</option>
          <option value="concluída">Concluída</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - <span className={`status-indicator status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
            <div className="button-group">
              <button onClick={() => handleFinish(task.id)}>Finalizar</button>
              <button onClick={() => handleDelete(task.id)}>Deletar</button>
              <button onClick={() => handleEdit(task)}>Editar</button>
            </div>
          </li>
        ))}
      </ul>
      {editTask && (
        <div className="modal">
          <form onSubmit={handleSaveEdit}>
            <input
              type="text"
              value={editTask.title || ''}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              value={editTask.description || ''}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            />
            <select
              value={editTask.status || 'pendente'}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
            >
              <option value="pendente">Pendente</option>
              <option value="em progresso">Em Progresso</option>
              <option value="concluída">Concluída</option>
            </select>
            <button type="submit">Salvar</button>
            <button onClick={() => setEditTask(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;