import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false)
        navigate("/");
        return;
      }
      setIsLoading(false)
      navigate("/login");
    });

    //   clean function
    return () => {
      unsubscibed();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user }}>
        {isLoading ? <Spin/> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
