import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Homepage from "@pages/overview/home";
import Auth from "@pages/auth/Auth";
import NotFound from "@pages/NotFound";
import ProtectedRoute from "@components/router/ProtectedRoute";
import Transactions from "@pages/payment/Transactions";
import OrdersPage from "@pages/orders/OrderPage";
import ConsignmentPage from "@pages/consignments/ConsignmentPage";
import ComplaintsPage from "@pages/complaints/ComplaintPage";
import InfoPage from "@pages/information/InfoPage";

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
];

// Tạo một hàm để bọc các route yêu cầu bảo vệ
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
