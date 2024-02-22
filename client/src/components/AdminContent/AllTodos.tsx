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
  const [isOpen, setIsOpen] = useState(false);
  const [currentTodoDescription, setCurrentTodoDescription] = useState("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

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

  return (
    <>
      <div className="allTodosContainer">
        <div className="allTodosTitleArea">
          <h3 className="allTodosTitle">All Todos</h3>
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
              {todos.length > 0 ? (
                todos.map((item, index) => (
                  <tr key={item._id}>
                    <th>{index + 1}</th>
                    <td>{item.userId ? item.userId.email : "Kullanıcı yok"}</td>
                    <td className="todoDescription">{item.description}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="allTodosOperatingArea">
                      <p>
                        <MdDelete
                          onClick={() => openModalDelete(item._id)}
                          className="allTodosIconDelete"
                        />
                      </p>
                      <p>
                        <RxEyeOpen
                          onClick={() => toggleDescription(item.description)}
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
              <tr>
                <th>#</th>
                <td>a@mailcom</td>
                <td>
                  {" "}
                  <div className="todoDescription">
                    Çok uzun metin buraya
                    gelecekvksnvdsnvıdsnvjnsjvnjsdnvjdnsjvnjnbjvfdjvnjd...
                  </div>
                </td>
                <td>date area</td>
                <td className="allTodosOperatingArea">
                  <p>
                    <MdDelete className="allTodosIconDelete" />
                  </p>
                  <p>
                    <RxEyeOpen className="allTodosIconEye" />
                  </p>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Todo İçerik Alanı</ModalHeader>
        <ModalBody>{currentTodoDescription}</ModalBody>
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
