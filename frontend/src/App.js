import LoginPage from './pages/src/login';
import RegPage from './pages/src/registration';
import UserPage from './pages/src/user-panel';
import AdminPage from './pages/src/admin-panel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="Login">
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/reg' element={<RegPage />} />
          <Route path='/userPage' element={<UserPage />} />
          <Route path='/adminPage' element={<AdminPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;