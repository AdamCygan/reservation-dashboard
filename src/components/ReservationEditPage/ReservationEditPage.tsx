import { useParams } from 'react-router';
import ErrorPage from '../ErrorPage/ErrorPage';

const ReservationEditPage = () => {
  const { id } = useParams();

  if (id === undefined) {
    return <ErrorPage code='404' message='Id rezerwacji nie zostało podane.' />;
  }

  return (
    <div className='form-title-wrapper'>
      <div className='form-title-header'>
        <h2>Rezerwacja</h2>
        <p>Formularz do edycji rezerwacji {id}</p>
      </div>
      <form></form>
    </div>
  );
};

export default ReservationEditPage;
