import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Error from './Components/error/Error'
import Landingpage from './pages/Landingpage'
import About from './pages/About'
import Contact from './Components/Contact/Contact'
import Services from './Components/Services/Services' 

function App() {
  const router = createBrowserRouter([
    {
    path: '/',
    element: <Landingpage />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '/contact',
      element: <Contact />
    },
    {
      path: '/services',
      element: <Services />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '*',
      element: <Error />
    }
  ])
  return (
    <>
    <RouterProvider router={router} />
  </>
  )
}

export default App