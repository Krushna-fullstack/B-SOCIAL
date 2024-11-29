import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineFilePdf, AiOutlineHome } from "react-icons/ai";
import { RiHotelLine } from "react-icons/ri";
import { PiHandbag } from "react-icons/pi";

const BottomNavbar = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect scrolling direction for mobile only
      if (window.innerWidth < 1024) {
        if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsScrollingUp(true);
        } else {
          // Scrolling down
          setIsScrollingUp(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navItems = [
    { icon: AiOutlineHome, label: "Home", to: "/" },
    { icon: MdContentCopy, label: "Notices", to: "/notices" },
    { icon: AiOutlineFilePdf, label: "Resources", to: "/resource" },
    { icon: RiHotelLine, label: "PG", to: "/pg" },
    { icon: PiHandbag, label: "Jobs", to: "/jobs" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full lg:w-[15%] lg:h-full z-20 p-4 lg:bg-secondary border-t lg:border-t-0 lg:border-r border-gray-700 transition-transform duration-300 bg-black  text-white ${
        isScrollingUp || window.innerWidth >= 1024
          ? "opacity-100 translate-y-0"
          : "opacity-80 translate-y-full"
      }`}
    >
      <div className="flex justify-between lg:flex-col lg:justify-evenly lg:items-center lg:h-full">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center lg:space-y-2 space-y-1 transition-all ease-in-out ${
                isActive
                  ? "text-primary"
                  : "text-neutral-content hover:text-primary"
              }`
            }
          >
            <Icon className="w-6 h-6 lg:w-10 lg:h-10" />
            <span className="hidden lg:block text-sm lg:text-base">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
