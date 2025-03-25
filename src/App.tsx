
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/home';
import Blog from './components/pages/blog';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>
    </Router>
  );
}

export default App;