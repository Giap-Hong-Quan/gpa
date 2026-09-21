import { createBrowserRouter, Navigate } from 'react-router-dom';
import GPACalculator from '../Pages/GPACalculator';

const router = createBrowserRouter([
  { path: '/', element: <GPACalculator /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;