import { z } from 'zod';
import { Reservation } from '../../types/reservation';

import './ReservationForm.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReservationContext } from '../../context/ReservationContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ReservationStatusEnum = z.enum([
  'Reserved',
  'Due In',
  'In House',
  'Due Out',
  'Checked Out',
  'Canceled',
  'No Show'
]);

const formSchema = z
  .object({
    id: z.string(),
    guestName: z.string().min(1, 'Wprowadź imię gościa'),
    checkInDate: z.string().min(1, 'Wprowadź datę zameldowania'),
    checkOutDate: z.string().min(1, 'Wprowadź datę wymeldowania'),
    status: ReservationStatusEnum,
    roomNumber: z.string().optional(),
    notes: z.string().optional(),
    email: z.string().optional()
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);

      return checkOut > checkIn;
    },
    {
      message: 'Data wymeldowania musi być poprawna',
      path: ['checkOutDate']
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface ReservationForm {
  reservation?: Reservation;
}

export default function ReservationForm({ reservation }: ReservationForm) {
  const navigate = useNavigate();
  const { addReservation, updateReservation, generateReservationId } =
    useReservationContext();

  const isEditMode = Boolean(reservation);
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: reservation
      ? {
          id: reservation.id,
          guestName: reservation.guestName,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          status: reservation.status,
          roomNumber: reservation.roomNumber,
          notes: reservation.notes,
          email: reservation.email
        }
      : {
          id: generateReservationId(),
          status: 'Reserved'
        },
    resolver: zodResolver(formSchema)
  });

  const handleDateChange = (
    field: 'checkInDate' | 'checkOutDate',
    value: string
  ) => {
    setValue(field, value);

    if (isEditMode) {
      trigger(field);
    } else if (field === 'checkInDate') {
      const newStatus = value === today ? 'Due In' : 'Reserved';
      setValue('status', newStatus);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode) {
        updateReservation(data);
        toast.success('Rezerwacja została zaktualizowana!');
      } else {
        addReservation(data);
        toast.success('Rezerwacja została utworzona!');
      }

      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Wystąpił błąd podczas zapisu. Spróbuj ponownie!');
    }
  };

  return (
    <div className='reservation-form-wrapper'>
      <form onSubmit={handleSubmit(onSubmit)} className='reservation-form-grid'>
        <input type='hidden' {...register('id')} />
        <div>
          <label htmlFor='guest-name'>Imię gościa</label>
          <input id='guest-name' type='text' {...register('guestName')} />
          {errors.guestName && (
            <p className='form-error'>{errors.guestName.message}</p>
          )}
        </div>
        <div className='data-row'>
          <div>
            <label htmlFor='check-in-date'>Data zameldowania</label>
            <input
              id='check-in-date'
              type='date'
              min={!isEditMode ? today : undefined}
              {...register('checkInDate')}
              onChange={(e) => handleDateChange('checkInDate', e.target.value)}
            />

            {errors.checkInDate && (
              <p className='form-error'>{errors.checkInDate.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='check-out-date'>Data wymeldowania</label>
            <input
              id='check-out-date'
              type='date'
              min={!isEditMode ? today : undefined}
              {...register('checkOutDate')}
              onChange={(e) => handleDateChange('checkOutDate', e.target.value)}
            />
            {errors.checkOutDate && (
              <p className='form-error'>{errors.checkOutDate.message}</p>
            )}
          </div>
        </div>
        <div className='data-row'>
          <div>
            <label htmlFor='room-number'>Numer pokoju</label>
            <input id='room-number' type='text' {...register('roomNumber')} />
            {errors.roomNumber && (
              <p className='form-error'>{errors.roomNumber.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='status'>Status</label>
            <select id='status' {...register('status')} disabled={!isEditMode}>
              {ReservationStatusEnum.options.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className='form-error'>{errors.status.message}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input id='email' type='text' {...register('email')} />
          {errors.email && <p className='form-error'>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor='notes'>Notatka</label>
          <input id='notes' type='text' {...register('notes')} />
          {errors.notes && <p className='form-error'>{errors.notes.message}</p>}
        </div>

        <button
          disabled={isSubmitting}
          type='submit'
          className='btn-action-secondary'
        >
          {isEditMode ? 'Edytuj' : 'Dodaj'} rezerwację
        </button>
      </form>
    </div>
  );
}
