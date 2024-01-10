import React from "react";
import "../styles/signup.scss";

const SignUp: React.FC = () => {
  return (
    <>
      <div className="container">
        <div className="box">
          <form>
            <h3>TaskMaster</h3>

            <div>
              <label>Rumuz:</label>
              <input className="" name="name" type="text" placeholder="NickName" />
            </div>

            <div>
              <label>E-mail:</label>
              <input type="email" name="email" placeholder="E-mail..." />
            </div>

            <div className="InputsPassword">
              <div className="passwordInput">
                <label>Password:</label>
                <input type="password" name="password" placeholder="********" />
              </div>

              <div className="passwordAgainInput">
                <label>Password Again:</label>
                <input type="password" placeholder="********" />
              </div>
            </div>

            <button>Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
