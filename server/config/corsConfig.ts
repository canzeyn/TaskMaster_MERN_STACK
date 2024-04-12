const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5001'], // bu yoldan gelen isteklere izin veriliyor
    credentials: true, // kimlik bilgileri (çerezler , oturum tokenleri) gönderimine izin verir istemci tarafına 
  };

  export default corsOptions;