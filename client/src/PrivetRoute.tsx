import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate , useLocation} from 'react-router-dom';
import axios from 'axios';

const PrivateRoute: React.FC<{ children: React.ReactNode , allowedRoles?: string[] }> = ({ children , allowedRoles}) => { // ReactNode tipi olabilecek bütün tipleri kapsar burada tüm tipleri alabileceğini gösteriyoruz
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // giriş yapılığ yapılmadığını anlamak için boolean tipinde bir state oluşturup içinde tutucağız
  const [userRole, setUserRole] = useState<string>("");
  const navigate = useNavigate(); // yönlendirme için kullanıcak fonksiyon
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => { // sunucudan kullanıcının giriş yapıp yapmadığını kontrol ediceğimiz fonksiyon
      try {
        const response = await axios.get('http://localhost:3000/auth/check', { withCredentials: true }); // sunucuya get isteğei atarak isAuthenticaded değişkenine erişiyoruz 
        setIsAuth(response.data.isAuthenticated); // isAuthenticated değişkeninde giriş bilgisi bulunuyor
        console.log("Sunucudan gelen yanıt:", response.data);
        console.log("role:" , response.data.role);
        setUserRole(response.data.role);
      } catch (error) { // eğer hata varsa kullanıcıyı giriş sayfasına yönlendiriyoruz bu kod bloğu ile
        console.error("Hata:", error);
        setIsAuth(false); // giriş statini false yapıyoruz giriş olmadığı için 
        navigate("/signin")
      }
    };

    checkAuth(); // fonksiyon çalıştırılıyor
  }, []); // component ilk yüklendiğinde çalışıyor ve eğer giriş yoksa geri yönlendiriyor giriş sayfasına

  if (isAuth === null) {
    return <div>Yükleniyor...</div>;  // Burada istediğiniz bir yüklenme göstergesi kullanabilirsiniz
  }



  const isAuthorized = allowedRoles ? allowedRoles.includes(userRole) : true; // allowedRoles tanımlıysa yani parametre olarak girilmişse bu girilen parametre değeri ile sunucudan gelen role değerini karşılaştırı eğer parametre olarak girlien role içeriyorsa bu state içindeki değeri eşleşme olursa true değer döner ve kullanıcı o sayfaya yönlendirilir eğer parametre girilmemişse role değeri olarak direkt olarak true değer alır ve kullanıcı erişir yani bakılmaz yetki durumuna herkes tarafından erişilebilir


  if (isAuth && !isAuthorized) {
    const from = location.state?.from?.pathname || "/todo"; // burada location nesnesinden state ile kullanıcın bilgileri gelir istersek bu bilgileri bizde doldurabilir başka bir rotaya gönderilecek oln bilgileri daha güvenli olması için state içinde taşınır
    // from ile state içindeki from bilgisi alınır bu kullanıcın geldiği adresdit burada taşınır from ile erişilir
    // pathname ile url kısmındaki yoldur en sonra bulunana rotadır urldeki eğer bunların hiçbir yoksa kişiyi todo rotasına yönlendirir 
    return <Navigate to={from} replace />; // kullanıcıyı from değişkeninden dönen sonuca yönlendirir
  }
  
  return isAuth && isAuthorized ? children : <Navigate to='/signin' state={{ from: location }} replace />; // eğer isAuth true bir ifade ise children döndürülür bu sayede app.tsx sayfasında belilenen rotaya gidilir eğer false değer ise isAuth değeri kullanıcı signin rotasına yönlendirilir geldiği yol yani giriş sayfasına yönlendirilmeden önceki sayfa location nesnesi içinde tutulur ve replace ile bu yol geçmişten silinir giriş yaptığı zaman location nesnesi içinde tutulan yere tekrardan yönlendirilir 
  // iki değerde true ise  kodlar çalışıyor 
};

export default PrivateRoute; 
