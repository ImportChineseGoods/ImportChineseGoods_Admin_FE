import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Homepage from "@pages/overview/home";
import Auth from "@pages/auth/Auth";
import NotFound from "@pages/NotFound";
import ProtectedRoute from "@components/router/ProtectedRoute";
import Cart from "@pages/shopping/Cart";
import ImportConsignment from "@pages/shopping/ImportConsignment";
import Deposits from "@pages/payment/Deposits";
import Withdraws from "@pages/payment/Withdraws";
import Transactions from "@pages/payment/Transactions";
import CreateProduct from "@pages/shopping/CreateProduct";
import Test from "@pages/test";
import OrdersPage from "@pages/orders/OrderPage";
import ConsignmentPage from "@pages/consignments/ConsignmentPage";
import ComplaintsPage from "@pages/complaints/ComplaintPage";
import InfoPage from "@pages/information/InfoPage";

const isAuthenticated = () => {
  return localStorage.getItem("access_token") !== null;
};

const protectedRoutes = [
  { path: "overview", component: <Homepage /> },
  { path: "create-product", component: <CreateProduct /> },
  { path: "cart", component: <Cart /> },
  { path: "import-consignment", component: <ImportConsignment /> },
  { path: "orders/*", component: <OrdersPage /> },
  { path: "consignments/*", component: <ConsignmentPage /> },
  { path: "deposits", component: <Deposits /> },
  { path: "withdraws", component: <Withdraws /> },
  { path: "transactions", component: <Transactions /> },
  { path: "complaints/*", component: <ComplaintsPage /> },
  { path: 'test', component: <Test /> },
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
