import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';

export const RoootLayout = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Outlet />
    </>
  );
};
