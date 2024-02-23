import React, { useEffect } from "react";
import { Table } from "reactstrap";
import "../../styles/allTodos.scss";
import { MdDelete } from "react-icons/md";
import { RxEyeOpen } from "react-icons/rx";
import axios from "axios";
import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "reactstrap";

interface User {
  email: string; // başka bir collection içinden geldiği için email değeri ayrı bir interfacede tanımlanıyor
}

interface Todo {
  _id: string;
  description: string;
  createdAt: string;
  isCompleted: boolean;
  userId: User | null; // userId null olabilir veya User tipinde bir nesne içerebilir
}

const AllTodos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTodoDescription, setCurrentTodoDescription] = useState<string>("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [searchQuery , setSearchQuery] = useState<string>("");



  const getAllTodos = async () => {
    const response = await axios.get("http://localhost:3000/getAllTodos", {
      withCredentials: true,
    });
    console.log(response.data);
    setTodos(response.data);
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const toggleDescription = (description: string) => {
    setCurrentTodoDescription(description); 
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const openModalDelete = (todoId: string) => {
    console.log("Silinmek üzere seçilen todo ID:", todoId);
    setDeleteItemId(todoId);
    setDeleteModalIsOpen(true);
  };

  const toggleModalDelete = () => {
    setDeleteModalIsOpen(!deleteModalIsOpen);
  };
  const deleteTodo = async (todoId: string) => {
    console.log("Silme işlemi için gönderilen todo ID:", todoId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/adminDeleteTodo/${todoId}`
      );
      if (response.status === 200) {
        console.log("Todo başarıyla silindi:", response.data);
        setDeleteModalIsOpen(false); // Silme modalını kapat
        getAllTodos(); // Todo listesini güncelle
      } else {
        console.error("Todo silinirken bir sorun oluştu.");
      }
    } catch (err: any) {
      console.log("allTodos.tsx: veri silinirken hata oldu:", err);
    }
  };

  useEffect(() => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (sortOrder === "asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
    setTodos(sortedTodos);
  }, [sortOrder]);

  const filteredTodos = todos.filter((todo) => { // burada todo adlı state içindeki tüm veriler filtrelenecek bu sayede istenen veriye göre arama yapılacak ve sadece o veriler getirelecek
    return todo.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()); // userId değeri yoksa yani false veya undefined değeri dönüyorsa email değerine erişilemez
    // email değerini küçük harfe indiriyoruz ki büyük küük harf farkı olmasın ve bu email değerlerinden hangisi searchQuery state içindeki değer ile eşleşirse onlar döndürülür ve değişken içine atılır ve bu değişken tablo içinde listelenir
  })

  return (
    <>
      <div className="allTodosContainer">
        <div className="allTodosTitleArea">
          <h3 className="allTodosTitle">All Todos</h3>

          <select onChange={(e) => setSortOrder(e.target.value) } value={sortOrder} className="allTodosSelect">
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>

        <div className="allTodosSearchArea">
          <input onChange={(e) => setSearchQuery(e.target.value)} type="text" className="allTodosSearchInput" placeholder="email ile arama yap..." />
        </div>

        <div className="allTodosTableArea">
          <Table className="allTodosTable" hover>
            <thead>
              <tr>
                <th>#</th>
                <th>email</th>
                <th className="todoDescription">todoDescription</th>
                <th>creadetAt</th>
                <th>operation</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.length > 0 ? (
                filteredTodos.map((item, index) => (
                  <tr key={item._id}>
                    <th>{index + 1}</th>
                    <td>{item.userId ? item.userId.email : "Kullanıcı yok"}</td>
                    {/* userId değeri yoksa kullanıcı yok yazılıyor  */}
                    <td className="todoDescription">{item.description}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    {/* yeni date nesnesi oluşturuluyor ve yerel tarih şekline çevriliyor */}
                    <td className="allTodosOperatingArea">
                      <p>
                        <MdDelete
                          onClick={() => openModalDelete(item._id)} // silinecek olan verinin id değerini state içine ekliyor ve modalı açıyor bu fonksiyon
                          className="allTodosIconDelete"
                        />
                      </p>
                      <p>
                        <RxEyeOpen
                          onClick={() => toggleDescription(item.description)} // description alanını state içine ekliyor ve modal açıyor bu fonksiyon 
                          className="allTodosIconEye"
                        />
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    hiç veri yok
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Todo İçerik Alanı</ModalHeader>
        <ModalBody>{currentTodoDescription}</ModalBody> 
        {/* seçili todo state içine atıldıktan sonra burada gösteriliyor state */}
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            kapat
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModalIsOpen} toggle={toggleModalDelete}>
        <ModalHeader toggle={toggleModalDelete}>Todo İçerik Alanı</ModalHeader>
        <ModalBody>Todo Silinsin mi</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => deleteItemId && deleteTodo(deleteItemId)}
          >
            sil
          </Button>
          <Button color="secondary">kapat</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AllTodos;
