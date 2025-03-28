import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { Reservation } from '../types/reservation';
import reservationsData from '../data/reservations.json';
import { mapResponseObjectToReservation } from '../utils/reservationUtils';

interface ReservationContextProps {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservation: (reservation: Reservation) => void;
  deleteReservation: (reservationId: string) => void;
  generateReservationId: () => string;
  moveReservationToStatus: (
    id: string,
    newStatus: Reservation['status']
  ) => void;
}

const ReservationContext = createContext<ReservationContextProps | undefined>(
  undefined
);

export const ReservationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [reservations, setReservations] = useState<Reservation[]>(
    reservationsData.map(mapResponseObjectToReservation)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      try {
        const validReservations = reservationsData.map(
          mapResponseObjectToReservation
        );
        setReservations(validReservations);
      } catch (error) {
        console.error('Błąd podczas przetwarzania danych rezerwacji:', error);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  const addReservation = useCallback((reservation: Reservation) => {
    setReservations((prev) => [...prev, reservation]);
  }, []);

  const updateReservation = useCallback((reservation: Reservation) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === reservation.id ? reservation : res))
    );
  }, []);

  const deleteReservation = useCallback((id: string) => {
    setReservations((prev) => prev.filter((res) => res.id !== id));
  }, []);

  const generateReservationId = useCallback(() => {
    if (reservations.length === 0) return 'res-001';

    const lastId = reservations[reservations.length - 1].id;
    const idNumber = parseInt(lastId.split('-')[1]);
    const nextId = (idNumber + 1).toString().padStart(3, '0');
    return `res-${nextId}`;
  }, [reservations]);

  const moveReservationToStatus = useCallback(
    (id: string, newStatus: Reservation['status']) => {
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
      );
    },
    []
  );

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        setReservations,
        addReservation,
        updateReservation,
        deleteReservation,
        generateReservationId,
        moveReservationToStatus
      }}
    >
      {loading ? (
        <div className='loading'>Ładowanie danych rezerwacji...</div>
      ) : (
        children
      )}
    </ReservationContext.Provider>
  );
};

export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  if (!context)
    throw new Error(
      'useReservationContext must be used inside ReservationProvider'
    );
  return context;
};
