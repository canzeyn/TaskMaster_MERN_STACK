import React, { useState, FormEvent } from "react";
import "../styles/profileSettings.scss";
import axios from "axios";
import { useEffect } from "react";

interface User {
  username: string;
  email: string;
  // Diğer gerekli alanlar...
}

const ProfileSetting: React.FC = () => {
  // State hooks to manage form data
  const [datas, setDatas] = useState<User | null>(null);
  const [settingUsername, setSettingUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState<File | null>(null); // burada statin file titpşnde veya null tipinde olabilecğini belirtiyoruz

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-user", {
        // sunucuya istek atılıyor ve kullanıcın isimi getiriliyor
        withCredentials: true,
      });
      setDatas(response.data); // state içine ekleniyor getirlien veriler
      setSettingUsername(response.data.name);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı", error);
    }
  };

  console.log(settingUsername);

  useEffect(() => {
    fetchUserData();
  }, []);

  console.log(datas);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // FormEvent<HTMLFormElement>  ile typescript tip tanımlaması yapıyoruz buradaki amaç event parametresinin ve bu fonskiyonun amacının htmlden gelen form elemanarını göndermek olduğudur yani submit olayı olacağı yani hangi event olacğını  ve hangi html element, ile yapılacağını belirtiyoruz burada HTMLformEvent ile form elentinden gelceğini belirtiyoruz bu sayede potansiyel hatalar engelleniyor
    // sunucuya o anki ve yeni olacak yani değişecek olan şifre gönderiliyor sunucu tarafında şifre değiştirilecek
    event.preventDefault();

    try {
      const response = await axios.post(
        // şifrelere gönderiliyor sunucuya post isteği ile
        "http://localhost:3000/update-password",
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      uploadPhoto();

      console.log("profileSetting:", response);
    } catch (error) {
      console.log("ProfileSetting.tsx: hata var:", error);
    }
  };

  const uploadPhoto = async () => {
    if (file) {
      // dosya eklenmişse kodlar çalışır
      const formData = new FormData(); // FormData nesnesi  dosya yükleme işlemleri için kullanılır amaç girilen dosyayı javascript formatına çevirir ve bu sayede ajax ile bu dosyayı sunucu tarafına kolayca yollanabilir
      formData.append("file", file); // anahtar değer çifti olarak eklenir formData içine file anahtar file state ise değer olarak girer state içine kullanıcının eklediği dosya vardır

      try {
        const response = await axios.post(
          "http://localhost:3000/upload-photo", // sunucuya gönderilir formData orada işlenerek cloudinary ve mongodb içine eklenecek
          formData,
          {
            headers: {
              // burada gönderilen verilerin ne verisi oldupunu belirtiyoruz sunucya
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Sunucudan dönen URL'i kullanarak kullanıcı bilgilerini güncelleyebilirsiniz.
        console.log(response.data);
      } catch (err) {
        console.error("Fotoğraf yüklenirken hata oluştu", err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // changeEvent ile bir input textarea gibi input elemanlarının içeriği değiştiğinde kullanılır burada yani input içeriği değişeceğini belirtiyoruz HTMLinputElement ilede hangi html elentinde olacğaını belirtiyoruz
    if (e.target.files) {
      // input alanında bir dosya seçilip seçilmediğine bakılıyor seçilmişse kodlar çalışır
      setFile(e.target.files[0]); // input içine girilen dosyalardan ilk olanı state içine ekler
    } else {
      setFile(null); // seçili dosya yoksa inputta state i null olarak ayarlar
    }
  };

  return (
    <div className="profile-setting-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="settingUsername"
            value={settingUsername}
            onChange={(e) => setSettingUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="new-password">Yeni Şifre</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="profile-image">Profil Fotoğrafı</label>
          <input type="file" id="profile-image" onChange={handleFileChange} />
        </div>
        <button type="submit">Ayarları Kaydet</button>
      </form>
    </div>
  );
};

export default ProfileSetting;
