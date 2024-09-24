import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineFilePdf, AiOutlineHome } from "react-icons/ai";
import { RiHotelLine } from "react-icons/ri";
import { PiHandbag } from "react-icons/pi";

const BottomNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { icon: AiOutlineHome, label: "Home", to: "/" },
    { icon: MdContentCopy, label: "Notices", to: "/notices" },
    { icon: AiOutlineFilePdf, label: "Resource", to: "/resource" },
    { icon: RiHotelLine, label: "PG", to: "/pg" },
    { icon: PiHandbag, label: "Job", to: "/jobs" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full lg:w-[20%] lg:h-full z-10 p-4 border-t lg:border-t-0 lg:border-r border-gray-300 transition-colors duration-300 ${
        isScrolled ? "bg-transparent opacity-50" : "bg-black"
      }`}
    >
      <div className="flex justify-between lg:flex-col lg:justify-evenly lg:items-center lg:h-full">
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            className="flex flex-col items-center justify-center space-y-1 lg:space-x-0 text-neutral-content hover:text-primary"
            to={to}
          >
            <Icon className="w-6 h-6 lg:w-10 lg:h-10" />
            {/* <span className="text-xs lg:text-sm font-medium">{label}</span> */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
