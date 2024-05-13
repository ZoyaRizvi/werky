import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
} from "@/widgets/layout";
import sideNavRoutes from "../sideNavRoutes.jsx";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useAuth } from '../context/authContext/index'

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const { userLoggedIn } = useAuth()

  return (
    <>
    {!userLoggedIn ? (<Navigate to={'/auth/sign-in'} replace={true} />)
    :
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={sideNavRoutes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {sideNavRoutes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
        </div>
      </div>
    </div>
    }
   </>
    
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
