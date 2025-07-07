import './App.css';
import Todo from './components/Todo'
import Sign_up from './components/Sign_up';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, } from "react-router-dom";

function App() {
  return <> <BrowserRouter>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/signup" element={<Sign_up />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  </>
}

export default App;
