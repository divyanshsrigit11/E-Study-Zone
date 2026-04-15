import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

const Login = lazy(() => import('./pages/public/Login'))
const Register = lazy(() => import('./pages/public/Register'))
const TrainerDashboard = lazy(() => import('./pages/trainer/trainerDashboard'))
const UserDashboard = lazy(() => import('./pages/user/userDashboard'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="d-flex justify-content-center mt-5">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/AdminLogin' element={<AdminLogin />} />
          <Route path='/trainerDashboard' element={<TrainerDashboard />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="*" element={<div className="text-center mt-5">404 - Page Not Found</div>} /> 
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

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