import React, { createContext, useContext, useState } from "react";

// Tạo UserContext để lưu thông tin người dùng
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User chứa thông tin như vai trò, token

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng UserContext
export const useUser = () => useContext(UserContext);
