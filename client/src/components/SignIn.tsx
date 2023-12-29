import "../styles/signin.scss";


const SignIn: React.FC = () => {
  return (
    <>

    
      <div className="container">
        <div className="box">
         <p>TaskMaster</p>   
          <form>
            <div>
              <label>Rumuz:</label>
              <input type="text" />
            </div>

            <div>
              <label>Password:</label>
              <input type="password" />
            </div>

            <button>Sign In</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
