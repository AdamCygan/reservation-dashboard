import React from 'react';
import './ErrorPage.css';

interface ErrorPageProps {
  code: string;
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, message }) => {
  return (
    <main className='error-container'>
      <div className='error-box'>
        <p className='error-code'>{code}</p>
        <h1 className='error-title'>{message}</h1>
        <div className='error-actions'>
          <a href='/' className='error-btn'>
            Go to dashboard
          </a>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
