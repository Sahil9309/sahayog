import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return ( 
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />  
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}