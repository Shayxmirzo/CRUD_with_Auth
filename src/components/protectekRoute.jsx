import { Navigate, Outlet } from "react-router-dom"

function ProtectekRoute({ auth, children }) {
  if (!auth) {
    return <Navigate to="/login" replace />
  }

  return children ? children : <Outlet />
}

export default ProtectekRoute