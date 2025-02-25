import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

const Navbar = () => (
  <nav className="navbar bg-zinc-900/75   p-4 text-white shadow-lg  fixed top-0 z-50 w-full backdrop-filter backdrop-blur-lg">

    <ul className="flex justify-between items-center">
        <li>
            <h1 className='p-4 text-3xl font-bold'>Digital Evaluator</h1>
        </li>
        <Typography variant="h3" className="text-center mb-4 text-blue-400 ">
          Admin Dashboard
        </Typography>
      <li className='flex justify-center items-center gap-4'>
      <li>
        <Link to="/admin/profile" className="hover:underline hover:text-blue-200">
          Profile
        </Link>
      </li>
      <li>
        <Link to="/admin/logout" className="bg-red-700 px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </Link>
      </li>
      </li>
    </ul>
  </nav>
);

export default Navbar;