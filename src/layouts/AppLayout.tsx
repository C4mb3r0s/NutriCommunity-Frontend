import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/navigation/Navbar'

export function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
