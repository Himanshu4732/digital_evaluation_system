import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { AdminDataContext } from '../context/AdminContext';
import { useContext, useEffect } from 'react';

const Navbar = () => {
  const { admin, setAdmin } = useContext(AdminDataContext);
  useEffect(() => {
    console.log(admin.name);
  }, [admin]);

  return (
    <nav className="bg-zinc-900/75 p-4 text-white shadow-lg fixed top-0 left-0 w-full backdrop-filter backdrop-blur-lg z-50">
      <ul className="flex justify-between items-center">
        <li>
          <Link to="/adminDashboard" className="p-4 text-3xl font-bold cursor-pointer">
            Digital Evaluator
          </Link>
        </li>
        <Typography variant="h3" className="text-center mb-4 text-blue-400">
          Admin Dashboard
        </Typography>
        <li className="flex justify-center items-center gap-4">
          <div>
            <Link to="/admin/profile" className="hover:underline hover:text-blue-200">
              Profile
            </Link>
          </div>
          <div>
            <Link to="/admin/logout" className="bg-red-700 px-4 py-2 rounded-lg hover:bg-red-600">
              Logout
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;