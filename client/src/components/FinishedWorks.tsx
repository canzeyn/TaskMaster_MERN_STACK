import React, { useEffect } from "react";
import "../styles/finishedWorks.scss";
import axios from "axios";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

interface DeletedTodo {
  _id: string;
  description: string;
}

const FinishedWorks: React.FC = () => {
  const [deletedTodos, setDeletedTodos] = useState<DeletedTodo[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedTodoDescription, setSelectedTodoDescription] = useState<string | null>(null);

  const navigate = useNavigate();

  const getDatas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getDeleteTodos", {
        withCredentials: true,
      });
      setDeletedTodos(response.data.deletedTodos);
    } catch (err) {
      console.log("finishedWorks.ts hata var:", err);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const goBack = () => {
    navigate(-1);
  }

  const toggle = () => setModal(!modal);

  const handleViewTodo = (description: string) => {
    setSelectedTodoDescription(description);
    toggle();
  };

  return (
    <>
      <div className="works-container">


        <div className="worksIcon">
        <IoIosArrowBack onClick={goBack} className="iconBack" />
          <h4>Finished Works</h4>
          <p></p>
        </div>

        <div className="deltedTodos">
          {deletedTodos.length > 0
            ? deletedTodos.map((item) => (
                <div onClick={() => handleViewTodo(item.description)}  key={item._id}>
                  <p className="todoItemWorks">{item.description}</p>
                </div>
              ))
            : ""}
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
      
        <ModalBody className="modal-body">
        {selectedTodoDescription ? <p>{selectedTodoDescription}</p> : <p>Bu todo için açıklama bulunamadı.</p>}
        </ModalBody>
        <ModalFooter>
         
          <Button color="secondary" onClick={toggle}>
            kapat
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FinishedWorks;
