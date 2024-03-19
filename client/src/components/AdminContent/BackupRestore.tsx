import "../../styles/backupRestore.scss";
import axios from "axios";
import { useState } from "react";

const BackupRestore = () => {
  const [backupName, setBackupName] = useState<string>("");
  const [restoreBackupName, setRestoreBackupName] = useState<string>("");
  const handleBackup = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/backup/${backupName}`,
        { withCredentials: true }
      );
      console.log(response.data);
      alert("Yedekleme işlemi başarılı.");
    } catch (err: any) {
      console.log("BackupRestore yedek alırkne hata:", err);
      alert("Yedekleme işlemi başarısız.");
    }
  };

  const handleRestore = async () => {
    if (!backupName) {
      alert("Lütfen bir yedek dosya adı giriniz.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/restore/${restoreBackupName}`
      );
      console.log(response.data);
      alert("Geri yükleme işlemi başarılı.");
    } catch (err) {
      console.error("BackupRestore geri yükleme sırasında hata:", err);
      alert("Geri yükleme işlemi başarısız.");
    }
  };
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
          <button className="backupButton" onClick={handleBackup}>
            verileri yedekle
          </button>
        </div>

        <div className="restoreArea">
          <h3 className="restoreTitle">
            Butona Tıklayarak Yedeklenen Verileri Tekrardan Yükleyin
          </h3>
          <input
            type="text"
            className="restoreInput"
            value={restoreBackupName}
            onChange={(e) => setRestoreBackupName(e.target.value)}
            placeholder="yüklencek dosya adı"
          />
          <button className="restoreButton" onClick={handleRestore}>
            verileri geri yükle
          </button>
        </div>
      </div>
    </>
  );
};

export default BackupRestore;
