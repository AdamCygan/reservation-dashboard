import { useParams } from 'react-router';
import ErrorPage from '../ErrorPage/ErrorPage';
import ReservationForm from '../ReservationForm/ReservationForm';
import { useReservationContext } from '../../context/ReservationContext';

const ReservationEditPage = () => {
  const { id } = useParams();
  const { reservations } = useReservationContext();

  if (id === undefined) {
    return <ErrorPage code='404' message='Id rezerwacji nie zostało podane.' />;
  }

  const reservation = reservations.find((res) => res.id === id);

  if (!reservation) {
    return <ErrorPage code='404' message='Nie znaleziono rezerwacji' />;
  }

  return (
    <div className='form-title-wrapper'>
      <div className='form-title-header'>
        <h2>Rezerwacja</h2>
        <p>Formularz do edycji rezerwacji {id}</p>
      </div>
      <ReservationForm reservation={reservation} />
    </div>
  );
};

export default ReservationEditPage;
