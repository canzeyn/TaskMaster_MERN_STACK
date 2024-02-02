import React, { useState, FormEvent, ChangeEvent } from "react";
import "../styles/profileSettings.scss";
import axios from "axios";
import { useEffect } from "react";

const ProfileSetting: React.FC = () => {
  // State hooks to manage form data
  const [settingUsername, setSettingUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingProfileImage, setSettingProfileImage] = useState<File | null>(
    null
  );

  useEffect(() => {
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-user", { // sunucuya istek atılıyor ve kullanıcın isimi getiriliyor
          withCredentials: true,
        });
        setSettingUsername(response.data.username); // state içine ekleniyor getirlien isim
        
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { // sunucuya o anki ve yeni olacak yani değişecek olan şifre gönderiliyor sunucu tarafında şifre değiştirilecek
    event.preventDefault();
    
    try {
      const response = await axios.post(  // şifrelere gönderiliyor sunucuya post isteği ile
        "http://localhost:3000/update-password",
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );
     
    } catch (error) {
       console.log("ProfileSetting.tsx: hata var:" , error);
    }
  };

  return (
    <div className="profile-setting-container">
      <form>
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
          <input type="file" id="profile-image" />
        </div>
        <button type="submit">Ayarları Kaydet</button>
      </form>
    </div>
  );
};

export default ProfileSetting;
