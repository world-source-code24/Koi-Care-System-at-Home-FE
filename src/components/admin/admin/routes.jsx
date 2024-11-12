import { Route, Routes } from "react-router-dom";

import Dashboard from "../../../page/admin/admin/dashboard";
import UserManagement from "../../../page/admin/admin/userManagement";
import ShopManagement from "../../../page/admin/admin/shopManagement";
import ProductManagement from "../../../page/admin/admin/productManagement";
import OrderList from "../../../page/admin/admin/orderList";
import Calculate from "../../../page/admin/admin/calculate";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/reporting" element={}></Route> */}
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/shopManagement" element={<ShopManagement />} />
      <Route path="/productManagement" element={<ProductManagement />} />
      <Route path="/orderList" element={<OrderList />} />
      <Route path="/calculate" element={<Calculate />} />
    </Routes>
  );
}
export default AdminRoutes;
