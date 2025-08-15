import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout.jsx"
import { UserContextProvider } from "./context/UserContext.jsx"; // Note the .jsx extension
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LandingPage from "./pages/LandingPage.jsx"
import AboutUs from "./pages/AboutUs.jsx";

// Configure Axios defaults
axios.defaults.baseURL = 'http://localhost:5000'; // Your backend server URL
axios.defaults.withCredentials = true; // Crucial: ensures cookies are sent with every request

function App() {
  return (
    <UserContextProvider>
      <Routes>
       <Route path="/" element={<Layout />}>
         <Route index element={<LandingPage />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/about" element={<AboutUs />} />
       </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;