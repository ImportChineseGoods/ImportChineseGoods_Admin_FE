import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Homepage from "@pages/overview/home";
import Auth from "@pages/auth/Auth";
import NotFound from "@pages/NotFound";
import ProtectedRoute from "@components/router/ProtectedRoute";
import Transactions from "@pages/customers/screens/Transactions";
import OrdersPage from "@pages/orders/OrderPage";
import ConsignmentPage from "@pages/consignments/ConsignmentPage";
import ComplaintsPage from "@pages/complaints/ComplaintPage";
import InfoPage from "@pages/information/InfoPage";
import Withdraws from "@pages/customers/screens/DepositWithdraw";
import CustomersPage from "@pages/customers/screens/CustomersPage";
import Parameters from "@pages/parameters/Parameters";
import CreateEmployee from "@pages/createEmployee/CreateEmployee";
import EmplpoyeePage from "@pages/employees/EmplpoyeePage";
import WarehouseTQPage from "@pages/warehouseTQ/WarehouseTQPage";
import WarehouseVNPage from "@pages/warehouseVN/WarehouseVNPage";
import StatisticsPage from "@pages/statistics/StatisticsPage";

const isAuthenticated = () => {
  return localStorage.getItem("access_token") !== null;
};

const protectedRoutes = [
  { path: "overview", component: <Homepage /> },
  { path: "orders/*", component: <OrdersPage /> },
  { path: "consignments/*", component: <ConsignmentPage /> },
  { path: "transactions", component: <Transactions /> },
  { path: "complaints/*", component: <ComplaintsPage /> },
  { path: 'information', component: <InfoPage /> },
  { path: "customers-list/*", component: <CustomersPage /> },
  { path: "create-transactions", component: <Withdraws /> },
  { path: "parameters", component: <Parameters /> },
  { path: "employees/*", component: <EmplpoyeePage /> },
  { path: "create-employee", component: <CreateEmployee /> },
  { path: "warehouse-tq/*", component: <WarehouseTQPage /> },
  { path: "warehouse-vn/*", component: <WarehouseVNPage /> },
  { path: "statistics/*", component: <StatisticsPage /> },
];

const createProtectedRoute = (path, component) => ({
  path,
  element: <ProtectedRoute isAuthenticated={isAuthenticated()}>{component}</ProtectedRoute>,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute isAuthenticated={isAuthenticated()}>
            <Homepage />
          </ProtectedRoute>
        ),
      },

      ...protectedRoutes.map(route => createProtectedRoute(route.path, route.component)),
    ],
  },
  {
    path: "auth/*",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
