
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/SignUp';
import SignIn from "./components/SignIn";
import Todo from "./components/Todo";
import PrivateRoute from "./PrivetRoute";
import ProfileSetting from "./components/ProfileSetting";
import FinishedWorks from "./components/FinishedWorks";
import Dashboard from "./components/Dashboard";

function App() {
  
  return (

    <>
        <Router>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/todo' element={<PrivateRoute>
              <Todo />
            </PrivateRoute>} />

            <Route path='/profileSettings' element={<PrivateRoute>
              <ProfileSetting />
            </PrivateRoute>} />

            <Route path='/finishedWorks' element={<PrivateRoute>
              <FinishedWorks />
            </PrivateRoute>} />

            <Route path='/dashboard' element={<PrivateRoute>
              <Dashboard />
            </PrivateRoute>} />

          </Routes>
        </Router>
     
    </>
  )
}

export default App
