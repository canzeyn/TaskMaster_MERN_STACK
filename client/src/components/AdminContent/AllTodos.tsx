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
  const [currentTodoDescription, setCurrentTodoDescription] =
    useState<string>("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1); // o an ki gösterilern verilerin sayfa numarası burada tutuluyor
  const [totalPages, setTotalPages] = useState(0); // toplam sayfa sayısı burada tutuluyor

  const getAllTodos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getAllTodos?page=${currentPage}&limit=10`,
        {
          // sunucuya istek atılıyor page ile gösterilemek istenen sayfa numarası gönderiliyor limit ile toplam kaç veri geleceği gönderiliyor
          withCredentials: true,
        }
      );
      console.log(response.data);
      setTodos(response.data.docs || []); // gelen cevap içindeki docs kısmı atılıyor state içine eğer yoksa boş dizi atılıyor state içine busayede hata alınmıyor
      setTotalPages(response.data.totalPages); // gelen cevap ile totalPages kısmındaki toplam sayfa sayısı state içine atılıyor
    } catch (err) {
      console.error("Veriler alınırken bir hata oluştu: ", err);
      setTodos([]);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, [currentPage]); // bakılan sayfa değişince tekrardan veriler çekiliyor

  const handlePrevPage = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1)); // kişi önceki sayfaya gitmesi için kullanıyor bu fonksyion amaç kullanıcı her  bir önce sayfaya gitmek için tıkladığında o an ki sayfadan bir çıkarıyor ve önceki sayfaya gidiyor kullanıcı
    // max ilede iki sayı arasından büyük olanı alır burada 1 den küçük bir numara olmaması için kullanıyoruz max methodunu
  };

  const handleNextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages)); // kullanıcı bir sonraki sayfaya gitmesi için kullanılır bu fonksiyon min ile iki değer arasından en küçük olan alınır bu sayede toplam sayfa sayısından büyük sayı gelmez
  };

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

  const filteredTodos = todos.filter((todo) => {
    // burada todo adlı state içindeki tüm veriler filtrelenecek bu sayede istenen veriye göre arama yapılacak ve sadece o veriler getirelecek
    return todo.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()); // userId değeri yoksa yani false veya undefined değeri dönüyorsa email değerine erişilemez
    // email değerini küçük harfe indiriyoruz ki büyük küük harf farkı olmasın ve bu email değerlerinden hangisi searchQuery state içindeki değer ile eşleşirse onlar döndürülür ve değişken içine atılır ve bu değişken tablo içinde listelenir
  });

  return (
    <>
      <div className="allTodosContainer">
        <div className="allTodosTitleArea">
          <h3 className="allTodosTitle">All Todos</h3>

          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="allTodosSelect"
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>

        <div className="allTodosSearchArea">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="allTodosSearchInput"
            placeholder="email ile arama yap..."
          />
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
          <div className="paginationArea">
            {/* Mevcut arayüz elemanları */}
            <button className="prevButton" onClick={handlePrevPage} disabled={currentPage === 1}>
              Önceki
            </button>
            <select className="selectList"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, index) => ( // array.from ile dizi olan bir yapıyı alıp dizi haline getirip liste şekilinde işleyebilirz burada toplam sayfa numarasını listeliyoruz
              // uzunluğu totalPages adlı state içinden geliyor dizi ilk başta bu uzunluk kadar yer alır ama veri içermez
              // ikinci kısımda _ ile geleneksel javascripte _ işareti ile bu alan atlanır ve kullanılamz ikinci kısım index kısmında her veri için baştan sona 1 den başlayara değer verir bir çeşit array.from ile map işlemi yapılır yani ikinci kısımda 
                <option key={index + 1} value={index + 1}>
                   {index + 1} 
                </option>
              ))}
            </select>
            <span>
              Sayfa {currentPage} / {totalPages}
            </span>
            <button className="nextButton"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </button>
          </div>
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
