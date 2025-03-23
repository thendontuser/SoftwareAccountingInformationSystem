import LoginPage from './pages/src/login';
import RegPage from './pages/src/registration';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="Login">
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/reg' element={<RegPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;