import React, { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, updateDoc, doc } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';  
import './index.css';

const TodoList = () => {
  const [task, setTask] = useState(""); 
  const [tasks, setTasks] = useState([]);  

 
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));  
      const tasksArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksArray);  
    };
    
    fetchTasks();  
  }, []);

 
  const addTask = async (e) => {
    e.preventDefault();  
    if (task.trim() === "") return;  

    
    await addDoc(collection(db, "tasks"), {
      name: task,
      completed: false  
    });

    setTask("");  
    
    
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(tasksArray);
  };

  
  const toggleCompleteTask = async (taskId, currentStatus) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { completed: !currentStatus });  

    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !currentStatus } : task
    );
    setTasks(updatedTasks);  
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1>
        <FontAwesomeIcon icon={faSeedling} style={{ color: '#ff8ca1', marginRight: '10px' }} />
        Lista de cosas por hacer
        </h1>
      <form onSubmit={addTask} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Agrega una nueva tarea"
          style={{
            padding: '10px',
            fontSize: '1.2rem',
            width: '70%',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          marginLeft: '10px',
          backgroundColor: '#ff8ca1',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Agregar tarea</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#ff8ca1',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}
          >
            <span style={{ flex: 1, fontSize: '1.2rem', textAlign: 'left' }}>{task.name}</span>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleteTask(task.id, task.completed)}
              style={{ width: '20px', height: '20px', accentColor: '#cdcbfc'}}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
