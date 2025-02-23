import React from 'react'
import { Routes, Route } from "react-router-dom";
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import StudentProtectWrapper from './components/StudentProtectWrapper';
import StudentDashboard from './pages/StudentDashboard';
import StudentLogout from './pages/StudentLogout';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        {/* <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} /> */}
        <Route
          path="/studentDashboard"
          element={
            <StudentProtectWrapper>
              <StudentDashboard />
            </StudentProtectWrapper>
          }
        />
        {/* <Route
          path="/adminDashboard"
          element={
            <AdminProtectWrapper>
              <AdminDashboard />
            </AdminProtectWrapper>
          }
        /> */}
        <Route
          path="/student/logout"
          element={
            <StudentProtectWrapper>
              <StudentLogout />
            </StudentProtectWrapper>
          }
        />
        {/* <Route
          path="/admin/logout"
          element={
            <AdminProtectWrapper>
              <AdminLogout />
            </AdminProtectWrapper>
          }
        /> */}
      </Routes>
    </div>
  )
}

export default App