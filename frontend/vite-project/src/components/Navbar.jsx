import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar bg-zinc-900/75   p-4 text-white shadow-lg  sticky top-0 z-50 backdrop-filter backdrop-blur-lg">

    <ul className="flex justify-between">
        <li>
            <h1 className='p-4 text-3xl font-bold'>Digital Evaluator</h1>
        </li>
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