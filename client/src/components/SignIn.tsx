import { useState, FormEvent } from "react";
import "../styles/signin.scss";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    
    interface signinData {
      email: string;
      password: string;
    }

    const singinData: signinData = { email, password };
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/signin", singinData , {withCredentials:true});

      if(response.data) {
        navigate("/todo")
      }

    } catch (err: any) {
      if(err.response) {
        console.log(err.response.data.message)
      } else {
        console.log("giriş sırasında bir hata oluştu")
      }
    }
  };
  return (
    <>
      <div className="container">
        <div className="box">
          <p>TaskMaster</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button>Sign In</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
