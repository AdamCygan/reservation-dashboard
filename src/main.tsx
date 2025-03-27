import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes.tsx';
import { ReservationProvider } from './context/ReservationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReservationProvider>
        <AppRoutes />
        <Toaster position='bottom-right' />
      </ReservationProvider>
    </BrowserRouter>
  </StrictMode>
);
