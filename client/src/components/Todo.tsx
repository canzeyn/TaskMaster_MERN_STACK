import React from "react";
import "../styles/todo.scss";
import { IoEnter } from "react-icons/io5";
import Header from "./Header";
import { useEffect } from "react";
 



const Todo: React.FC = () => {

  useEffect(() => {
    
    fetch("http://localhost:3000/todo" , {mode: 'cors',})
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.error('Hata:', err));
  }, []);


  return (
    <>
    
    
      <div className="todo-container">
        <Header />
        <div className="todo-todoArea">
          <h3>Todo Content.</h3>
          
          <div className="todo-todoTextarea">
            <textarea />
            <button><IoEnter className="ikonButton" /></button>
          </div>

          <div className="todo-todoList">
            <div>
              <p>item 1 fndjnnd vdjsf sgf g fjdsfdjsgıvds vdsıjvıdsvnfs vıfsnvds vdısjfds cdksmvıdsjdv dksnıd </p>
            </div>

            <div>
              <p>item 1</p>
            </div>

            <div>
              <p>item 1</p>
            </div>

            <div>
              <p>item 1</p>
            </div>

            <div>
              <p>item 1</p>
            </div>
          
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
