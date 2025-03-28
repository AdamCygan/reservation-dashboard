import React from 'react';
import { Reservation } from '../../../types/reservation';
import { formatDate } from '../../../utils/dateFormatters';
import './ReservationCard.css';
import { toast } from 'sonner';
import { useReservationContext } from '../../../context/ReservationContext';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from 'react-router';

interface ReservationCardProps {
  reservation: Reservation;
  statusColor: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  statusColor
}) => {
  const { deleteReservation } = useReservationContext();

  const handleDeleteReservation = (id: string) => {
    try {
      deleteReservation(id);
      toast.success('Rezerwacja została usunięta!');
    } catch (error) {
      console.error(error);
      toast.error('Wystąpił błąd podczas usuwania. Spróbuj ponownie!');
    }
  };

  return (
    <div className='reservation-card'>
      <div
        className='card-status-indicator'
        style={{ backgroundColor: statusColor }}
      ></div>
      <div className='card-content'>
        <div className='card-header'>
          <h3 className='guest-name'>{reservation.guestName}</h3>
          <div className='action-button'>
            <Menu>
              <MenuButton
                className='btn-action'
                onPointerDown={(e) => e.stopPropagation()}
              >
                ⋮
              </MenuButton>
              <MenuItems anchor='bottom end' className='menu-dropdown'>
                {(reservation.status === 'Due In' ||
                  reservation.status === 'Reserved') && (
                  <MenuItem>
                    <Link
                      to={`/edit/${reservation.id}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      className='menu-item'
                    >
                      Edytuj
                    </Link>
                  </MenuItem>
                )}
                <MenuItem>
                  <button
                    className='menu-item'
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    Usuń
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className='stay-dates'>
          <div className='date-range'>
            <span className='date-label'>Przyjazd:</span>
            <span className='date-value'>
              {formatDate(reservation.checkInDate)}
            </span>
          </div>
          <div className='date-range'>
            <span className='date-label'>Wyjazd:</span>
            <span className='date-value'>
              {formatDate(reservation.checkOutDate)}
            </span>
          </div>
        </div>

        {reservation.roomNumber && (
          <div className='room-number'>
            <span className='room-label'>Pokój:</span>
            <span className='room-value'>{reservation.roomNumber}</span>
          </div>
        )}

        {reservation.notes && (
          <div className='notes'>
            <p>{reservation.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
