import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URL da API no Vercel
const API_BASE_URL = 'https://gerenciador-tarefas-nu-seven.vercel.app';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pendente' });
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar tarefas: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, newTask, {
        headers: { 'Content-Type': 'application/json' },
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'pendente' });
    } catch (error) {
      setError('Erro ao criar tarefa: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleFinish = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}/finish`);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (error) {
      setError('Erro ao finalizar tarefa: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      setError('Erro ao deletar tarefa: ' + error.message);
    }
  };

  const handleEdit = (task) => {
    setEditTask({ ...task });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${editTask.id}`, editTask, {
        headers: { 'Content-Type': 'application/json' },
      });
      setTasks(tasks.map(task => task.id === editTask.id ? response.data : task));
      setEditTask(null);
    } catch (error) {
      setError('Erro ao editar tarefa: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <div className="loading">Carregando tarefas...</div>;
  if (error) return (
    <div className="app">
      <div className="error">{error}</div>
      <button onClick={fetchTasks} style={{ marginTop: '20px' }}>Tentar Novamente</button>
    </div>
  );

  return (
    <div className="app">
      <h1>Gerenciador de Tarefas</h1>
      
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Título da tarefa"
          required
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Descrição (opcional)"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="pendente">Pendente</option>
          <option value="em progresso">Em Progresso</option>
          <option value="concluída">Concluída</option>
        </select>
        <button type="submit">Adicionar Tarefa</button>
      </form>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Nenhuma tarefa encontrada. Crie sua primeira tarefa!
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-description">{task.description}</div>}
                <span className={`status-${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </div>
              <div className="button-group">
                <button onClick={() => handleFinish(task.id)}>
                  {task.status === 'concluída' ? '✓ Concluída' : 'Finalizar'}
                </button>
                <button onClick={() => handleDelete(task.id)}>Deletar</button>
                <button onClick={() => handleEdit(task)}>Editar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editTask && (
        <div className="modal">
          <form onSubmit={handleSaveEdit} className="edit-form">
            <h3>Editar Tarefa</h3>
            <input
              type="text"
              value={editTask.title || ''}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              placeholder="Título da tarefa"
              required
            />
            <input
              type="text"
              value={editTask.description || ''}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              placeholder="Descrição (opcional)"
            />
            <select
              value={editTask.status || 'pendente'}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
            >
              <option value="pendente">Pendente</option>
              <option value="em progresso">Em Progresso</option>
              <option value="concluída">Concluída</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button type="submit" style={{ flex: 1 }}>Salvar</button>
              <button onClick={() => setEditTask(null)} style={{ flex: 1 }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;