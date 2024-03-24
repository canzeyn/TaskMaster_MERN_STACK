import "../../styles/backupRestore.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal,  ModalBody, ModalFooter } from "reactstrap";

// yedek alma veya yedek alınanı geri yükleme işlemleri sadece client tarafta hata veriyor sunucu tarafaı çalılıyıor ve yedek dosya alınıyor veya ekleniyor
// yedek alma işlemi için homebrew kuruldu
//homebrew ile  mongodb kuruldu bilgisyara
const BackupRestore = () => {
  const [backupName, setBackupName] = useState<string>("");
  const [restoreBackupName, setRestoreBackupName] = useState<string>("");
  const [fileName, setFileName] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [backupPassword, setBackupPassword] = useState("");

  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);

  const handleBackup = async (password: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/backup/${backupName}`, {password} , 
        { withCredentials: true }
      );
      console.log(response.data);
      alert("Yedekleme işlemi başarılı.");
      setBackupName("");
      setModal(!modal);
    } catch (err: any) {
      console.log("BackupRestore yedek alırkne hata:", err);
      setBackupName("");
      setModal(!modal);
      alert("Yedekleme işlemi başarısız.");
    }
  };

  const handleRestore = async (password: string) => {
    if (!restoreBackupName) {
      alert("Lütfen bir yedek dosya adı giriniz.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/restore/${restoreBackupName}` , {password} , {withCredentials:true}
      );
      console.log(response.data);
      alert("Geri yükleme işlemi başarılı.");
      setModal2(!modal2);
    } catch (err) {
      console.error("BackupRestore geri yükleme sırasında hata:", err);
      setModal2(!modal2)
      alert("Geri yükleme işlemi başarısız.");
    }
  };

  const getFileNames = async () => {
    try {
      const fileNames = await axios.get("http://localhost:3000/backupFileList");
      console.log(fileNames.data);
      setFileName(fileNames.data);
    } catch (err) {
      console.log("backupRestore.tsx dosya isimleri alınırken hata:", err);
    }
  };

  useEffect(() => {
    getFileNames();
  }, []);
  return (
    <>
      <div className="backupContainer">
        <div className="backupArea">
          <h3 className="backupTitle">
            Butona Tıklayarak verilerin Kopyasını Alın
          </h3>
          <input
            className="backupInput"
            type="text"
            value={backupName}
            onChange={(e) => {
              setBackupName(e.target.value);
            }}
            placeholder="alınacak yedegin ismini giriniz"
          />
          <button className="backupButton" onClick={toggle}>
            verileri yedekle
          </button>
        </div>

        <div className="restoreArea">
          <h3 className="restoreTitle">
            Butona Tıklayarak Yedeklenen Verileri Tekrardan Yükleyin
          </h3>
          <select
            className="restoreSelect"
            value={restoreBackupName}
            onChange={(e) => setRestoreBackupName(e.target.value)}
          >
            <option value="" disabled>
              Bir dosya seçiniz
            </option>
            {fileName.map((backup) => (
              <option key={backup} value={backup}>
                {backup}
              </option>
            ))}
          </select>
          <button className="restoreButton" onClick={toggle2}>
            verileri geri yükle
          </button>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          <input
            className="modalPassword"
            type="password"
            value={backupPassword}
            onChange={(e) => setBackupPassword(e.target.value)}
            placeholder="password"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleBackup(backupPassword)}>
            Backup
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal2} toggle={toggle2}>
        <ModalBody>
          <input
            className="modalPassword"
            type="password"
            value={backupPassword}
            onChange={(e) => setBackupPassword(e.target.value)}
            placeholder="password"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleRestore(backupPassword)}>
            restore 
          </Button>{" "}
          <Button color="secondary" onClick={toggle2}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default BackupRestore;
