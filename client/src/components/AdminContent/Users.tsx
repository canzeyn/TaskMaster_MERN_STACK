import { Table } from "reactstrap";
import { MdDelete } from "react-icons/md";
import { VscRequestChanges } from "react-icons/vsc";
import "../../styles/users.scss";
import { MdAdminPanelSettings } from "react-icons/md";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "reactstrap";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

const Users = () => {
  const [modalAdmin, setModalAdmin] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [searchQuery , setSearchQuery] = useState("");

  const toggleAdmin = () => setModalAdmin(!modalAdmin);

  const handleAdminClick = (userId: string) => {
    setAdminId(userId);
    toggleAdmin();
  };

  const toggleModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const confirmDelete = (userId: string) => {
    setDeleteUserId(userId); // Silinecek kullanıcının ID'sini ayarla
    setModalDelete(true); // Modalı aç
  };

  const handleEditClick = (userId: string, currentName: string) => {
    setEditUserId(userId); // ismi değiştirielcek olan kullanıcının id değeri alınıyor
    setNewName(currentName); //
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllUser", {
        // tüm kayıtlı kullanıcıları çekmemizi sağlıyor
        withCredentials: true,
      });
      console.log(response.data);
      setUser(response.data);
    } catch (err) {
      console.log("Users.tsx: hata var ", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // silinecek olan kullanıcının id değerini alıyoruz
    try {
      await axios.delete(`http://localhost:3000/deleteUser/${userId}`, {
        // id değerini sunucu tarafına gönderiliyor
        withCredentials: true,
      });
      console.log("Kullanıcı başarıyla silindi:", userId);
      // Kullanıcı silindikten sonra kullanıcı listesini güncelle
      fetchData();
    } catch (err) {
      console.error("Kullanıcı silinirken bir hata oluştu:", err);
    }
  };

  const updateUser = async (userId: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/updateUser/${userId}`, // patch ile sadece bir nesneyi güncelleyecğiz burada isim değerini güncelleyeğiz kişinin ismini bulmak için id değeri gönderiliyor sunucuya patch isteği ile
        {
          name: newName, // yeni girilen isim değeri gönderiliyor
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      fetchData(); // Kullanıcı listesini güncelle
      setEditUserId(null); // Düzenleme modunu kapat
      setNewName(""); // newName'i sıfırla
    } catch (err) {
      console.error("Kullanıcı güncellenirken bir hata oluştu:", err);
    }
  };

  const makeAdmin = async (adminId: string) => {
    try {
      await axios.patch(
        `http://localhost:3000/makeAdmin/${adminId}`,
        {},
        {
          withCredentials: true,
        }
      );
      alert(`Kullanıcı başarıyla admin yapıldı: ${adminId}`);
      fetchData(); // Kullanıcı listesini güncelle
    } catch (error) {
      console.error("Admin yapılırken bir hata oluştu:", error);
      alert("Admin yapılırken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const sortedUsers = [...user].sort((a, b) => {
      // ilk olarak spread operatörü ile dizinin bir kopyasını alıyoruz sonrasında sort ile bu dizide karşılaştırma yapılıyor a ve b dizideki elemanları temsil ediyor her seferinde iki eleman karşılaştırılıyor
      if (sortOrder === "desc") {
        // desc seçilmişse yani yeniden eskiye bir sıralama yapılacaksa kodlar çalışıyor
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // burada çıkarma işlemi yapılıyor getTime() ile verilen zaman değerleri 1970 den bu zamana kadar olan zamanı veriyor geçen süreyi eğer sonuç pozitifse b a dan büyük oluyor yani b daha yeni oluyor ve b önce koyuluyor
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() // eğer yukarıdakinin tam tersi bir durum olursa yani asc seçilmişse a - b ile eskiden yeniye sıralama yapılır
        );
      }
    });

    setUser(sortedUsers);
  }, [sortOrder]);

  const filteredUser = user.filter((item) => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="usersContainer">
        {/* title */}
        <div className="usersTitleArea">
          <h3 className="usersTitle">All Users</h3>
          <select
            className="usersSelect"
            name="sorting"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </div>

        <div className="usersSearchInputArea">
          <input onChange={e => setSearchQuery(e.target.value)} type="text" className="usersSearchInput" />
        </div>

        {/* table */}
        <div className="usersTableArea">
          <Table className="usersTable" hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Creadet At</th>
                <th>role</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {filteredUser.length > 0 ?  filteredUser.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {editUserId === item._id ? ( // eğer seçilen id değeri ile o an dönen id değeri eşleşirse o kısımda bir input alanı çıkıyor
                      <>
                        <input
                          type="text"
                          value={newName} // girilen yeni isim state içine ekleniyor
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <Button
                          color="success"
                          onClick={() => updateUser(item._id)} // yeni girilen name değeri kaydediliyor
                        >
                          Kaydet
                        </Button>
                      </>
                    ) : (
                      item.name // veri tabanından gelen isim gösteriliyor ilk olarak
                    )}
                  </td>
                  <td>{item.email}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("en-CA")}
                  </td>
                  <td>{item.role}</td>
                  <td className="usersOperation">
                    <p>
                      <MdDelete
                        className="usersIconDelete"
                        onClick={() => confirmDelete(item._id)}
                      />
                    </p>{" "}
                    <p>
                      <VscRequestChanges
                        className="usersIconChange"
                        onClick={() => handleEditClick(item._id, item.name)} // fonksiyona id ve name değerleri gönderiliyor argüman olarak
                      />
                    </p>{" "}
                    <p>
                      <MdAdminPanelSettings
                        className="usersIconAdmin"
                        onClick={() => handleAdminClick(item._id)}
                      />
                    </p>
                  </td>
                </tr>
              )) : (
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

      <div>
        <Modal isOpen={modalAdmin} toggle={toggleAdmin}>
          <ModalHeader toggle={toggleAdmin}>Yetkilendirme İşlemi</ModalHeader>
          <ModalBody>
            Kullanıcyı Yetkilendirmek İstediğinizden Eminmisiniz ?
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                if (adminId) {
                  makeAdmin(adminId);
                  toggleAdmin(); // Modalı kapat
                }
              }}
            >
              Yetkilendir
            </Button>{" "}
            <Button color="secondary" onClick={toggleAdmin}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modalDelete}>
          <ModalHeader>Silme İşlemi</ModalHeader>
          <ModalBody>Kullancı Silmek istediğinizden Emin misiniz ?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                if (deleteUserId) {
                  handleDeleteUser(deleteUserId); // userId gönderiliyor burada fonksiyona
                  setDeleteUserId(null); // Silme işlemi tamamlandıktan sonra temizle
                  setModalDelete(false); // Modalı kapat
                }
              }}
            >
              Sil
            </Button>{" "}
            <Button color="secondary" onClick={toggleModalDelete}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Users;
