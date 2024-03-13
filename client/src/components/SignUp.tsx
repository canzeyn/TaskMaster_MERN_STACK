import React from "react";
import "../styles/signup.scss";
import axios from "axios";
import { useState, FormEvent } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    interface UserData {
      name: string;
      email: string;
      password: string;
      // role: string;
    }

    const userData: UserData = { name, email, password  };

    try {
      const response = await axios.post(
        "http://localhost:3000/signup",
        userData
      );

      console.log("kullanıcı kaydedildi:", response.data);
      if (response.status === 201) {
        navigate("/signin");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        console.log("kullanıcı kaydıyla ilgili hata var");
      }
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.errors) { // error.response sunudan bir response olup olmadığına bakılır error nesnesi içinde 
        // error.response.data ile dönen bu nesnein içieriğine bakılır var olup olmadığına 
        //error.response.data.errors ile dönen nesne içindeki verierlde errors adına bir nesne arar
        // Sunucudan gelen hata mesajlarını errors state'ine ata
        setErrors(error.response.data.errors);

        setTimeout(() => {
          setErrors([]);
        }, 3000); 
      } else {
        // Genel bir hata mesajı göster
        setErrors(["Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."]);

        setTimeout(() => {
          setErrors([]);
        }, 3000); 
      }
    }
  };
  return (
    <>
      <div className="container">
        <div className="box">
          <form onSubmit={handleSubmit}>
            <h3>TaskMaster</h3>

            <div>
              <label>Rumuz:</label>
              <input
                className=""
                value={name}
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="NickName"
              />
            </div>

            <div>
              <label>E-mail:</label>
              <input
                type="email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail..."
              />
            </div>

            <div className="InputsPassword">
              <div className="passwordInput">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              <div className="passwordAgainInput">
                <label>Password Again:</label>
                <input type="password" placeholder="********" />
              </div>
            </div>

            <button>Sign Up</button>

            {errors.length > 0 && <div className="signupErrorArea">
              <p className="signupError">{errors +" " +  "3sn..."}</p>
            </div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
