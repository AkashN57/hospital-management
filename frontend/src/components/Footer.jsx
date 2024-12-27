import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 text-justify">
            MediHouse Hospital offers exceptional healthcare services with a
            team of trusted doctors, ensuring quality treatment. Patients can
            conveniently book appointments online, saving time and effort.
            Experience hassle-free scheduling and access to expert medical care,
            all at your fingertips.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">MediHouse</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <NavLink to="/" className="py-1 hover:underline">
              HOME
            </NavLink>
            <NavLink to="/about" className="py-1 hover:underline">
              ABOUT
            </NavLink>
            <NavLink to="/contact" className="py-1 hover:underline">
              CONTACT
            </NavLink>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Inquires</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+9476767676</li>
            <li>group18@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ MediHouse.com - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
