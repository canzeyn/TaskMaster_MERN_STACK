import React, { useEffect, useState } from "react";
import "../styles/todo.scss";
import { IoEnter } from "react-icons/io5";
import Header from "./Header";
import axios from "axios";
import { RxEyeOpen } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface TodoItem {
  // veri tabanına eklenen veriler çekilirken bu interface göre geliyor
  _id: string;
  description: string;
  deadline: Date;
}

const Todo: React.FC = () => {
  const [todoDescription, setTodoDescription] = useState(""); // textare içineki todo buraya ekleneiyor ve buradaki veri tabanına gönderiliyor
  const [todos, setTodos] = useState<TodoItem[]>([]); // veri tabanındaki tüm veriler buraya çekiliyor
  const [loading, setLoading] = useState(true); // yükleme durumu buradan kontrol ediliyor
  const [modal, setModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null); // Seçili todo'yu tutacak
  const [deadline, setDeadline] = useState<Date | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formattedDeadline = deadline ? deadline.toISOString() : null; // tarihi okunabilcek bir formata çeviriyor

    try {
      const response = await axios.post(
        // veriler post ile ekleniyor
        "http://localhost:3000/addTodo", // sunucu tarafındaki bu endpointe gönderiliyor veriler
        { description: todoDescription, deadline: formattedDeadline }, //  textaredaki veri sunucuya gönderilince description olarak orada kullanılıyor
        { withCredentials: true } // cookies kısmını kullanabilmek için kimlik bilgilerini aktif ediyoruz
      );
      console.log(response.data);
      await handleGetTodos(); // form tekrar gönderildiğinde tüm veriler tekrardan çekilerek yeni eklenen veride çekilir
      setTodoDescription("");
      setDeadline(null);
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

  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/deleteTodo/${id}`, {
        // silinecek olan todonun id değeri gönderiliyor
        withCredentials: true,
      });

      await handleGetTodos(); // silinme işlemi sunucu tarafında gerçekleştikten sonra tüm todolar tekrar getirliyor
    } catch (err) {
      console.log("todo.tsx silme işlemi hata var:", err);
    }
  };

  const handleSaveChange = async () => {
    if (selectedTodo) {
      // seçili todo varsa kodlar çalışır
      try {
        const changeData = axios.put(
          `http://localhost:3000/updateTodo/${selectedTodo._id}`, // seçilen todonun id değeri gönderiliyor sunucuya
          { description: selectedTodo.description }, //  seçili todonun description alanı gönderiliyor payload olarak
          { withCredentials: true }
        ); // put isteği ie var olan bir veriyi güncellemek için kullanılır endPoint olarak seçili todonun id değeri gönderiliyor sunucuya
        // payload olarak gönderilen veride description key olarak içerisinde seçili todunun description alanını gönderiyoruz en sonda kimlik bilgilerini gönderimine izin veriyoruz
        setTodos(
          todos.map(
            (
              todo // tüm todolar dönülüyor
            ) =>
              todo._id === selectedTodo._id // seçilen todonun id si ile tüm todolar içinde eşleşen olursa kodlar çalışır
                ? { ...todo, description: selectedTodo.description } // spread operatörü ile todo adlı statin bir kopyası alınır ve seçili todonun description alanını güncellenir yenisi ile
                : todo // eğer eşleşme olmazsa tüm state olduğu gibi kalır
          )
        );

        console.log(changeData);
        toggle(); // modal kapatılır
      } catch (err) {
        console.log("todo.tsx: güncellenirken hata oluştur hata:", err);
      }
    }
  };

  const handleViewTodo = (todo: TodoItem) => {
    // bu fonksiyonun kullanıldığı yerde tıklanan todonun tüm verisini alıyoruz ve state içine ekliyoruz ve modal açıyoruz bu sayede o todonun tüm yazısına erişebiliyoruz
    setSelectedTodo(todo);
    toggle();
  };

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
            loading ? <div>Veriler yükleniyor...</div> : null // Yükleme durumu true iken bir yükleme göstergesi göster
          }

          <form onSubmit={handleSubmit} className="todo-todoTextarea">
            <div className="formArea">
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
            </div>
            <div className="dateArea">
              <DatePicker
                className="dateTimePicker"
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                dateFormat="dd/MM/yyyy" // Tarih formatını belirle
              />
            </div>
          </form>

          <div className="todo-todoList">
            {todos.length > 0 ? (
              todos.map((item) => (
                <div className="todoItem" key={item._id}>
                  <p>{item.description}</p>
                  <p>deadline:{item.deadline ? new Date(item.deadline).toLocaleDateString() : "no deadline"}</p>
                  <div className="icon-container">
                    <RxEyeOpen
                      className="iconEye"
                      onClick={() => {
                        handleViewTodo(item); // todo nesnesinin tüm bilgileri burada var gönderiliyor id değeri description ve diğerleri
                      }}
                    />
                    <MdDelete
                      className="iconDelete"
                      onClick={() => handleDeleteTodo(item._id)} // todonun id değeri gönderiliyor
                    />
                  </div>
                  
                </div>
                
              ))
            ) : (
              <p>herhangi bir todo yok ekleyin !</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody className="modal-body">
          <textarea
            className="todo-edit-textarea"
            value={selectedTodo ? selectedTodo.description : ""}
            onChange={(e) =>
              setSelectedTodo(
                selectedTodo
                  ? { ...selectedTodo, description: e.target.value } // seçili todonun bir kopyası alınıyor ve alınan kopyaya girilen yazı ekleniyor
                  : null
              )
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button> {selectedTodo ? (selectedTodo.deadline ? new Date(selectedTodo.deadline).toLocaleDateString() : "no deadline") : "Loading..."}</Button>
          <Button color="primary" onClick={handleSaveChange}>
            güncelle
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            kapat
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Todo;
