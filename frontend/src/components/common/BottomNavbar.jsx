import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineFilePdf, AiOutlineHome } from "react-icons/ai";
import { RiHotelLine } from "react-icons/ri";
import { PiHandbag } from "react-icons/pi";

const BottomNavbar = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsScrollingUp(true);
      } else {
        // Scrolling down
        setIsScrollingUp(false);
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
    { icon: MdContentCopy, label: "Notice", to: "/notice" },
    { icon: AiOutlineFilePdf, label: "Resource", to: "/resource" },
    { icon: RiHotelLine, label: "PG", to: "/pg" },
    { icon: PiHandbag, label: "Job", to: "/jobs" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full lg:w-[20%] lg:h-full z-10 p-4 border-t lg:border-t-0 lg:border-r border-gray-300 transition-all duration-300 ${
        isScrollingUp ? "opacity-100" : "opacity-50"
      } bg-black`}
    >
      <div className="flex justify-between lg:flex-col lg:justify-evenly lg:items-center lg:h-full">
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            className="flex flex-col items-center justify-center space-y-1 lg:space-x-0 text-neutral-content hover:text-primary"
            to={to}
          >
            <Icon className="w-6 h-6 lg:w-10 lg:h-10" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
