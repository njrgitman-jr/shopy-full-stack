import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {

//for showing purpose only #3 02:58:55
  const user = useSelector((state) => state.user); //inside the reduc i have set this state.user which stored in userSlice.js userSelector comming from react reducx
  // console.log("user dashboard", user);
  
  return (
  <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr] gap-4">
        {/* Left: Sticky User Menu */}
        <div className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto border-r pr-4">
            <UserMenu />
          </div>
        </div>

        {/* Right: Page Content */}
        <div className="bg-white min-h-[75vh]">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
