// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import { OrderProvider, KarigarProvider, UserProvider } from "./context";
import { InternetConnectionWrapper } from "./components/InternetConnectionWrapper";
import { useUser } from "./context/UserContext";

// Create a new component to wrap the routes and check for token expiration
const AuthWrapper = ({ children }) => {
  const { checkTokenAndRedirect } = useUser();

  React.useEffect(() => {
    const checkToken = () => {
      checkTokenAndRedirect();
    };

    // Check token expiration on mount and every 5 minutes
    checkToken();
    const intervalId = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [checkTokenAndRedirect]);

  return children;
};

function App() {
  return (
    <InternetConnectionWrapper>
      <UserProvider>
        <OrderProvider>
          <KarigarProvider>
            <Router>
              <AuthWrapper>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <Navigate to="/orders" />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthWrapper>
            </Router>
          </KarigarProvider>
        </OrderProvider>
      </UserProvider>
    </InternetConnectionWrapper>
  );
}

export default App;
