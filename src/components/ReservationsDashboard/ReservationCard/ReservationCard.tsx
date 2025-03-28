import React from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Reservation } from '../../../types/reservation';
import { formatDate } from '../../../utils/dateFormatters';
import { useReservationContext } from '../../../context/ReservationContext';
import './ReservationCard.css';

interface ReservationCardProps {
  reservation: Reservation;
  statusColor: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  statusColor
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: reservation.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 0.2s ease'
  };
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='reservation-card'
    >
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
