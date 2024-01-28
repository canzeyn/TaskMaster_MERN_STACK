import React, { useEffect, useState } from "react";
import "../styles/todo.scss";
import { IoEnter } from "react-icons/io5";
import Header from "./Header";
import axios from "axios";

interface TodoItem {
  // veri tabanına eklenen veriler çekilirken bu interface göre geliyor
  _id: string;
  description: string;
}

const Todo: React.FC = () => {
  const [todoDescription, setTodoDescription] = useState(""); // textare içineki todo buraya ekleneiyor ve buradaki veri tabanına gönderiliyor
  const [todos, setTodos] = useState<TodoItem[]>([]); // veri tabanındaki tüm veriler buraya çekiliyor 
  const [loading, setLoading] = useState(true); // yükleme durumu buradan kontrol ediliyor

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      
      const response = await axios.post( // veriler post ile ekleniyor
        "http://localhost:3000/addTodo", // sunucu tarafındaki bu endpointe gönderiliyor veriler
        { description: todoDescription }, //  textaredaki veri sunucuya gönderilince description olarak orada kullanılıyor 
        { withCredentials: true } // cookies kısmını kullanabilmek için kimlik bilgilerini aktif ediyoruz
      );
      console.log(response.data);
      await handleGetTodos(); // form tekrar gönderildiğinde tüm veriler tekrardan çekilerek yeni eklenen veride çekilir
      setTodoDescription('');
    } catch (err) {
      console.log("todo.tsx hata var:", err);
    }
  };

  const handleGetTodos = async () => {
    try {
      setLoading(true); // yükleme işleminin başladığını belirtiyoruz
      const fetchDatas = await axios.get("http://localhost:3000/getTodos", { // veriler çekiliyor suncudan bu endpointe istek gönderiliyor bunun için
        withCredentials: true, // kimlik bilgileri kullanılmasını aktif ediyoruz
      });
     setTodos(fetchDatas.data.todos); // sunudan gelen verilere erişiyoruz
      setLoading(false); // yükleme işlemi bitince kapatılıyor
      console.log("gelen veriler:" , todos);
    } catch (err) {
      console.log("(todo.tsx) hata:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  return (
    <>
      <div className="todo-container">
        <Header />
        <div className="todo-todoArea">
          <h3>Todo Content.</h3>
          {
           
             loading ? <div>Veriler yükleniyor...</div> : "" // Yükleme durumu true iken bir yükleme göstergesi göster
            
          }

          <form onSubmit={handleSubmit} className="todo-todoTextarea">
            <textarea
              onChange={(e) => {
                setTodoDescription(e.target.value);
              }}
              value={todoDescription}
              name="todoDescription"
            />
            <button>
              <IoEnter className="ikonButton" />
            </button>
          </form>

          <div className="todo-todoList">
            {todos ? todos.map((item) => (
              <div key={item._id}>
                <p>{item.description}</p>
              </div> 
            )) : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
