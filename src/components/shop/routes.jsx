import { Route, Routes } from "react-router-dom";
import OrderList from "../../page/shop/orderList";

function ShopRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<OrderList />} />
    </Routes>
  );
}
export default ShopRoutes;
