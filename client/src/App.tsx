import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Todo from "./components/Todo";
import PrivateRoute from "./PrivetRoute";
import ProfileSetting from "./components/ProfileSetting";
import FinishedWorks from "./components/FinishedWorks";
import Dashboard from "./components/Dashboard";
import UsersLogContent from "./components/AdminContent/LogContent/UsersLogContent";
import { LogDataProvider } from "./components/context/logContext.jsx";
import { useTranslation } from 'react-i18next';
import i18n from "./i18n.tsx";

function App() {
  const { t } = useTranslation();
  return (
    <>
      <LogDataProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/todo"
              element={
                <PrivateRoute>
                  <Todo />
                </PrivateRoute>
              }
            />

            <Route
              path="/profileSettings"
              element={
                <PrivateRoute>
                  <ProfileSetting />
                </PrivateRoute>
              }
            />

            <Route
              path="/finishedWorks"
              element={
                <PrivateRoute>
                  <FinishedWorks />
                </PrivateRoute>
              }
            />

            {/* bu rotaya istek gelince privetRoutes sayfasında parametre olarak admin değeri gönderiliyor bu sayede giriş yapan kullanıcın role değeri admin değilse giriş yapamıyor */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/usersLogContent"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <UsersLogContent />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </LogDataProvider>
    </>
  );
}

export default App;
