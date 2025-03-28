import ReservationForm from '../ReservationForm/ReservationForm';

const ReservationAddPage = () => {
  return (
    <div className='form-title-wrapper'>
      <div className='form-title-header'>
        <h2>Rezerwacja</h2>
        <p>Formularz do dodania rezerwacji</p>
      </div>
      <ReservationForm />
    </div>
  );
};

export default ReservationAddPage;
