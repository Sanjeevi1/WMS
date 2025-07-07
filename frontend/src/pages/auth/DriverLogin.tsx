import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to my-route
    navigate('/driver/my-route');
  }, [navigate]);

  return null;
};

export default DriverLogin; 