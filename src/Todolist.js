import React, { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, updateDoc, doc } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';  
import './index.css';

const TodoList = () => {
  const [task, setTask] = useState("");  // Guardar la nueva tarea ingresada por el usuario
  const [tasks, setTasks] = useState([]);  // Guardar la lista de tareas obtenidas de Firebase

  // Cargar las tareas desde Firebase cuando se monta el componente
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));  // Obtenemos las tareas
      const tasksArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksArray);  // Guardamos las tareas en el estado
    };
    
    fetchTasks();  // Llamamos a la función que carga las tareas
  }, []);

  // Función para agregar una nueva tarea
  const addTask = async (e) => {
    e.preventDefault();  // Evitar el refresco de la página
    if (task.trim() === "") return;  // Evitar agregar tareas vacías

    // Agregamos la tarea a Firebase
    await addDoc(collection(db, "tasks"), {
      name: task,
      completed: false  // Inicialmente, la tarea no está completada
    });

    setTask("");  // Limpiar el campo de texto
    
    // Recargamos las tareas para incluir la nueva
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(tasksArray);
  };

  // Función para marcar una tarea como completada o incompleta
  const toggleCompleteTask = async (taskId, currentStatus) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { completed: !currentStatus });  // Alternamos el estado `completed`

    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !currentStatus } : task
    );
    setTasks(updatedTasks);  // Actualizamos la lista de tareas
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
