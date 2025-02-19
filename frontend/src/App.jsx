import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Signup from './pages/Signup'
import Index from './pages/Index'
import Games from './pages/Games'
import Manage from './pages/Manage'
import Update from './pages/Update'
import Detail from './pages/Detail'
import AddGames from './pages/AddGames'
import User from './pages/User'
import Admins from './pages/Admin/Admins'
import Users from './pages/Admin/Users'
import AddUser from './pages/Admin/AddUser'
import UpdateUser from './pages/Admin/UpdateUser'


function App() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/index",
      element: <Index/>
    },
    {
      path: "/games",
      element: <Games/>
    },
    {
      path: "/manage",
      element: <Manage/>
    },
    {
      path: "/update/:slug",
      element: <Update/>
    },
    {
      path: "/detail/:slug",
      element: <Detail/>
    },
    {
      path: "/add",
      element: <AddGames/>
    },
    {
      path: "/profile",
      element: <User/>
    },
    {
      path: "/admin",
      element: <Admins/>
    },
    {
      path: "/user",
      element: <Users/>
    },
    {
      path: "/adduser",
      element: <AddUser/>
    },
    {
      path: "/updateuser/:slug",
      element: <UpdateUser/>
    },
  ])

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
