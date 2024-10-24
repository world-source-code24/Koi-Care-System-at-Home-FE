import { Route, Routes } from "react-router-dom";
import Dashboard from "../../page/admin/dashboard";
import UserManagement from "../../page/admin/userManagement";
import ShopManagement from "../../page/admin/shopManagement";
import ProductManagement from "../../page/admin/productManagement";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/reporting" element={}></Route> */}
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/shopManagement" element={<ShopManagement />} />
      <Route path="/productManagement" element={<ProductManagement />} />
    </Routes>
  );
}
export default AdminRoutes;
