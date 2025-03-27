import { Route, Routes } from 'react-router';
import App from '../App';
import ReservationAddPage from '../components/ReservationAddPage/ReservationAddPage';
import ReservationEditPage from '../components/ReservationEditPage/ReservationEditPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/add' element={<ReservationAddPage />} />
      <Route path='/edit/:id' element={<ReservationEditPage />} />
    </Routes>
  );
};

export default AppRoutes;
