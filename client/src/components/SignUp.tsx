import React from "react";
import "../styles/signup.scss";
import axios from 'axios';
import { AxiosError } from 'axios';
import { useState , FormEvent } from "react";

const SignUp: React.FC = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {

    event.preventDefault();

    interface UserData {
      name: string;
      email: string;
      password: string;
    }

    const userData: UserData = {name  , email , password};

    try {
      const response = await axios.post('http://localhost:3000/signup' , userData);

      console.log("kullanıcı kaydedildi:" , response.data);
      setName("");
      setEmail("");
      setPassword("");
    }catch(error) {
      const axiosError = error as AxiosError;
      console.error('Kayıt sırasında hata oluştu:', axiosError.response ? axiosError.response.data : axiosError);
    }

  }
  return (
    <>
      <div className="container">
        <div className="box">
          <form onSubmit={handleSubmit}>
            <h3>TaskMaster</h3>

            <div>
              <label>Rumuz:</label>
              <input className="" value={name} name="name" type="text" onChange={e => setName(e.target.value)} placeholder="NickName" />
            </div>

            <div>
              <label>E-mail:</label>
              <input type="email" value={email} name="email" onChange={e => setEmail(e.target.value)} placeholder="E-mail..." />
            </div>

            <div className="InputsPassword">
              <div className="passwordInput">
                <label>Password:</label>
                <input type="password" value={password} name="password" onChange={e => setPassword(e.target.value)} placeholder="********" />
              </div>

              <div className="passwordAgainInput">
                <label>Password Again:</label>
                <input type="password" placeholder="********" />
              </div>
            </div>

            <button >Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
