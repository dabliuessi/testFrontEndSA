import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRouteAdmin({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  if (!token || !usuario || usuario.tipo !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}
