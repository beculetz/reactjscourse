import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NavBar } from './Nav/NavBar';
import { NotFound } from '../features/NotFound/NotFound';
import { Auth } from '../features/Auth/Auth';
import { Profile } from '../features/Auth/Profile';
import { AuthContextProvider } from '../features/Auth/AuthContext';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import { RequireAuth } from '../features/Auth/RequireAuth';
import { AsanaDeadlines } from '../features/AsanaDeadlines/AsanaDeadlines';

/*
<Route
            path="todos"
            element={
              <RequireAuth>
                <Todos />
              </RequireAuth>
            }
          />
          <Route path="comm" element={<Parent />} />
          <Route
            path="counter"
            element={<Counter initialValue={3} largeStep={10} smallStep={2} />}
          />
*/

export function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<RequireAuth><><div className="container "><h1>Home</h1></div></></RequireAuth>} />
          <Route
            path="deadlines"
            element={
              <RequireAuth>
                <AsanaDeadlines />
              </RequireAuth>
            }
          />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}
