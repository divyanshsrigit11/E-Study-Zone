import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Standard imports immediately catch missing files and errors
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import TrainerDashboard from './pages/trainer/trainerDashboard'; 
import UserDashboard from './pages/user/userDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/trainerDashboard" element={<TrainerDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="*" element={<div className="text-center mt-5 text-danger fw-bold">404 - Page Not Found</div>} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;

// import React from 'react'
// import {BrowserRouter, Routes, Route} from "react-router-dom"
// import { lazy, Suspense } from "react"
// const Login = lazy(() => import('./pages/public/Login'))
// const Register = lazy(() => import('./pages/public/Register'))
// const TrainerDashboard = lazy(() => import('./pages/trainer/trainerDashboard'))
// const UserDashboard = lazy(() => import('./pages/user/userDashboard'))
// const App = () => {
//   return (
//     <>
//       <BrowserRouter>
//         <Suspense fallback={<div>...Loading</div>}>
//           <Routes>
//             <Route path="/" element={<Login/>}></Route>
//             <Route path="/register" element={<Register/>}></Route>
//             {/* admin route */}
//             <Route path='/adminDashboard'></Route>
//             {/* trainer dashboard */}
//             <Route path='/trainerdashboard' element={<TrainerDashboard/>}></Route>
//             {/* user dashboard */}
//             <Route path="/userdashboard" elememnt={<UserDashboard/>}></Route>
//           </Routes>
//         </Suspense>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App