import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Lobby from './screens/Lobby';
import Room from './screens/Room';
import Navbar from './screens/Navbar';
import Footer from './screens/Footer';

function App() {
  return (
    <div className='App'>

      <Navbar />
      <Routes>

        <Route path='/' element={<Lobby />} />
        <Route path='/room/:roomId' element={<Room />} />

      </Routes>
      <Footer />

    </div>
  );
}

export default App;
