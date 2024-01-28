
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/SignUp';
import SignIn from "./components/SignIn";
import Todo from "./components/Todo";
import PrivateRoute from "./PrivetRoute";

function App() {
  
  return (

    <>
        <Router>
          <Routes>
            <Route path='signup' element={<SignUp />} />
            <Route path='signin' element={<SignIn />} />
            <Route path='todo' element={<PrivateRoute>
              <Todo />
            </PrivateRoute>} />
          </Routes>
        </Router>
     
    </>
  )
}

export default App
