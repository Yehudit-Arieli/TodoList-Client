// import React, { useEffect, useState } from 'react';
// import service from './service.js';

// function App() {
//   const [newTodo, setNewTodo] = useState("");
//   const [todos, setTodos] = useState([]);

//   async function getTodos() {
//     const todos = await service.getTasks();
//     setTodos(todos);
//   }

//   async function createTodo(e) {
//     e.preventDefault();
//     await service.addTask(newTodo);
//     setNewTodo("");//clear input
//     await getTodos();//refresh tasks list (in order to see the new one)
//   }

//   // דוגמה לשינוי בתוך App.js או היכן שמתבצעת הקריאה
// async function updateCompleted(item, isComplete) {
//   await service.setCompleted(item.id, item.name, isComplete);
//   // רענון הרשימה לאחר העדכון
//   setTodos(await service.getTasks());
// }

//   async function deleteTodo(id) {
//     await service.deleteTask(id);
//     await getTodos();//refresh tasks list
//   }

//   useEffect(() => {
//     getTodos();
//   }, []);

//   return (
//     <section className="todoapp">
//       <header className="header">
//         <h1>todos</h1>
//         <form onSubmit={createTodo}>
//           <input className="new-todo" placeholder="Well, let's take on the day" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
//         </form>
//       </header>
//       <section className="main" style={{ display: "block" }}>
//         <ul className="todo-list">
//           {todos.map(todo => {
//             return (
//               <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
//                 <div className="view">
//                   <input className="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
//                   <label>{todo.name}</label>
//                   <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </section>
//     </section >
//   );
// }

// export default App;




import React, { useEffect, useState } from 'react';
import service from './service.js';
import Login from './Login.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken"));
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // פונקציית טעינת המשימות
  async function getTodos() {
    try {
      const todos = await service.getTasks();
      setTodos(todos);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
      }
    }
  }

  // 1. ה-useEffect חייב להיות כאן - לפני כל return!
  useEffect(() => {
    if (isAuthenticated) {
      getTodos();
    }
  }, [isAuthenticated]);

  // פונקציות העזר
  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(item, isComplete) {
    await service.setCompleted(item.id, item.name, isComplete);
    getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    getTodos();
  }

  // 2. רק כאן, בסוף, אנחנו בודקים אם להציג לוגין או את האפליקציה
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <button 
          onClick={() => { localStorage.removeItem("accessToken"); setIsAuthenticated(false); }}
          style={{ float: 'right', margin: '10px', padding: '5px' }}
        >
          Logout
        </button>
        <form onSubmit={createTodo}>
          <input className="new-todo" placeholder="What needs to be done?" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos.map(todo => (
            <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
              <div className="view">
                <input className="toggle" type="checkbox" checked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
                <label>{todo.name}</label>
                <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default App;