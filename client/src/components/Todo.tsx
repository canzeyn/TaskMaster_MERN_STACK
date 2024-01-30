import React, { useEffect, useState } from "react";
import "../styles/todo.scss";
import { IoEnter } from "react-icons/io5";
import Header from "./Header";
import axios from "axios";
import { RxEyeOpen } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface TodoItem {
  // veri tabanına eklenen veriler çekilirken bu interface göre geliyor
  _id: string;
  description: string;
}

const Todo: React.FC = () => {
  const [todoDescription, setTodoDescription] = useState(""); // textare içineki todo buraya ekleneiyor ve buradaki veri tabanına gönderiliyor
  const [todos, setTodos] = useState<TodoItem[]>([]); // veri tabanındaki tüm veriler buraya çekiliyor
  const [loading, setLoading] = useState(true); // yükleme durumu buradan kontrol ediliyor
  const [modal, setModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null); // Seçili todo'yu tutacak

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        // veriler post ile ekleniyor
        "http://localhost:3000/addTodo", // sunucu tarafındaki bu endpointe gönderiliyor veriler
        { description: todoDescription }, //  textaredaki veri sunucuya gönderilince description olarak orada kullanılıyor
        { withCredentials: true } // cookies kısmını kullanabilmek için kimlik bilgilerini aktif ediyoruz
      );
      console.log(response.data);
      await handleGetTodos(); // form tekrar gönderildiğinde tüm veriler tekrardan çekilerek yeni eklenen veride çekilir
      setTodoDescription("");
    } catch (err) {
      console.log("todo.tsx hata var:", err);
    }
  };

  const handleGetTodos = async () => {
    try {
      setLoading(true); // yükleme işleminin başladığını belirtiyoruz
      const fetchDatas = await axios.get("http://localhost:3000/getTodos", {
        // veriler çekiliyor suncudan bu endpointe istek gönderiliyor bunun için
        withCredentials: true, // kimlik bilgileri kullanılmasını aktif ediyoruz
      });
      setTodos(fetchDatas.data.todos); // sunudan gelen verilere erişiyoruz
      setLoading(false); // yükleme işlemi bitince kapatılıyor
      console.log("gelen veriler:", todos);
    } catch (err) {
      console.log("(todo.tsx) hata:", err);
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id:string) => {
    try {
      await axios.delete(`http://localhost:3000/deleteTodo/${id}`, {
        withCredentials: true,
      });

      await handleGetTodos();
    } catch (err) {
      console.log("todo.tsx silme işlemi hata var:", err);
    }
  };

  const handleViewTodo = (todo: TodoItem) => { // bu fonksiyonun kullanıldığı yerde tıklanan todonun tüm verisini alıyoruz ve state içine ekliyoruz ve modal açıyoruz bu sayede o todonun tüm yazısına erişebiliyoruz
      setSelectedTodo(todo);
      toggle();
  }

  const toggle = () => setModal(!modal);

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
            {todos.length > 0 
              ? todos.map((item) => (
                  <div className="todoItem" key={item._id}>
                    <p>{item.description}</p>
                    <div className="icon-container">
                    <RxEyeOpen className="iconEye" onClick={() => { handleViewTodo(item) }} />
                      <MdDelete
                        className="iconDelete"
                        onClick={() => handleDeleteTodo(item._id)}
                      />
                    </div>
                  </div>
                ))
              : <p>herhangi bir todo yok ekleyin !</p>}
          </div>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody className="modal-body">
              { selectedTodo?.description }
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Todo;
