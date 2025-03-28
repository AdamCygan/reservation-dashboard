import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable
} from '@dnd-kit/core';
import ReservationCard from './ReservationCard/ReservationCard';
import { useReservationContext } from '../../context/ReservationContext';
import './ReservationBoard.css';
import { Reservation, ReservationStatus } from '../../types/reservation';

interface ReservationBoardProps {
  reservations: Reservation[];
}

const ReservationBoard: React.FC<ReservationBoardProps> = ({
  reservations
}) => {
  const [activeReservation, setActiveReservation] =
    useState<Reservation | null>(null);
  const { moveReservationToStatus } = useReservationContext();

  const groupedReservations = useMemo(() => {
    const groups: Record<ReservationStatus, Reservation[]> = {
      'Reserved': [],
      'Due In': [],
      'In House': [],
      'Due Out': [],
      'Checked Out': [],
      'Canceled': [],
      'No Show': []
    };

    reservations.forEach((reservation) => {
      groups[reservation.status].push(reservation);
    });

    return groups;
  }, [reservations]);

  const statusColors: Record<ReservationStatus, string> = {
    'Reserved': '#3498db',
    'Due In': '#2ecc71',
    'In House': '#9b59b6',
    'Due Out': '#f39c12',
    'Checked Out': '#7f8c8d',
    'Canceled': '#e74c3c',
    'No Show': '#c0392b'
  };

  const allowedStatusTransitions: Record<
    ReservationStatus,
    ReservationStatus[]
  > = {
    'Reserved': ['Canceled', 'Due In'],
    'Due In': ['Canceled', 'No Show', 'In House'],
    'In House': ['Checked Out'],
    'Due Out': [],
    'Checked Out': ['In House'],
    'Canceled': ['Reserved'],
    'No Show': []
  };

  const handleDragStart = (event: DragStartEvent) => {
    const reservation = reservations.find((r) => r.id === event.active.id);
    if (reservation) {
      setActiveReservation(reservation);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveReservation(null);
    if (!over) return;

    const reservation = reservations.find((r) => r.id === active.id);
    if (!reservation) return;

    const currentStatus = reservation.status;
    const overId = over.id as string;

    const newStatus = Object.keys(groupedReservations).includes(overId)
      ? (overId as ReservationStatus)
      : reservations.find((r) => r.id === overId)?.status;

    if (!newStatus || currentStatus === newStatus) return;

    if (!allowedStatusTransitions[currentStatus].includes(newStatus)) {
      toast.error(`Nie można przenieść z ${currentStatus} do ${newStatus}`);
      return;
    }

    moveReservationToStatus(reservation.id, newStatus);
  };

  return (
    <div>
      <div className='reservation-actions'>
        <Link to='/add' className='btn-action-secondary'>
          Dodaj rezerwację
        </Link>
      </div>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className='reservation-board'>
          {Object.entries(groupedReservations).map(
            ([status, reservationList]) => (
              <div key={status} className='status-column'>
                <div
                  className='status-header'
                  style={{
                    backgroundColor: statusColors[status as ReservationStatus]
                  }}
                >
                  <h2>{status}</h2>
                  <span className='reservation-count'>
                    {reservationList.length}
                  </span>
                </div>
                <DroppableColumn id={status as ReservationStatus}>
                  {reservationList.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      statusColor={statusColors[reservation.status]}
                    />
                  ))}
                  {reservationList.length === 0 && (
                    <div className='empty-status'>Brak rezerwacji</div>
                  )}
                </DroppableColumn>
              </div>
            )
          )}
        </div>
        <DragOverlay>
          {activeReservation && (
            <ReservationCard
              reservation={activeReservation}
              statusColor={statusColors[activeReservation.status]}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const DroppableColumn = ({
  id,
  children
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} data-status={id} className='reservation-list'>
      {children}
    </div>
  );
};

export default ReservationBoard;
