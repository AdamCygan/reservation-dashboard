import './App.css';
import ReservationBoard from './components/ReservationsDashboard/ReservationBoard';
import Header from './components/Header/Header';
import { useReservationContext } from './context/ReservationContext';

function App() {
  const { reservations } = useReservationContext();

  return (
    <div className='app-container'>
      <Header />
      <main className='main-content'>
        <ReservationBoard reservations={reservations} />
      </main>
    </div>
  );
}

export default App;
