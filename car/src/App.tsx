import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Error from './Components/error/Error'
import Landingpage from './pages/Landingpage'
import About from './pages/About'
import Contact from './Components/Contact/Contact'
import Services from './Components/Services/Services' 
import Homee from './Components/Homee/Homee'
import Reset from './Components/Reset/Reset'
import SendCodeForm from './Components/SendCode/SendCode'
import EnterNewPassword from './Components/Reset/EnterNewPassword'




function App() {
  const router = createBrowserRouter([
    {
    path: '/',
    element: <Landingpage />
    },
    {
    path: 'sendCode',
    element: <Reset />
   },

    {
      path: '/about',
      element: <About />
    },
    {
      path: '/reset',
      element: <SendCodeForm />
    },
    {
      path: '/contact',
      element: <Contact />
    },
    {
  path: '/home',
  element: <Homee />
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
    },
    {
     path: '/verify',
     element: <Reset />
    },
    
    {
      path: '/reset-password',
      element: <EnterNewPassword /> // Step 3: set new password
    },
    
  ])
  return (
    <>
    <RouterProvider router={router} />
  </>
  )
}

export default App