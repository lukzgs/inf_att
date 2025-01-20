import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import About from '../pages/About';
import Login from '../pages/Login';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;