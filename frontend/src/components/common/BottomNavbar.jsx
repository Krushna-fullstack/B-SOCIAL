import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineFilePdf, AiOutlineHome } from "react-icons/ai";
import { RiHotelLine } from "react-icons/ri";
import { PiHandbag } from "react-icons/pi";

const BottomNavbar = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const lastScrollY = useRef(0);
  const location = useLocation();

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Handle scroll and resize events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const throttledScroll = throttle(handleScroll, 100);
    
    window.addEventListener("scroll", throttledScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { icon: AiOutlineHome, label: "Home", to: "/" },
    { icon: MdContentCopy, label: "Notices", to: "/notices" },
    { icon: AiOutlineFilePdf, label: "Resources", to: "/resource" },
    { icon: RiHotelLine, label: "PG", to: "/pg" },
    { icon: PiHandbag, label: "Jobs", to: "/jobs" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full lg:w-[15%] lg:h-full z-50 p-4 lg:bg-secondary border-t lg:border-t-0 lg:border-r border-gray-700 transition-transform duration-300 bg-black text-white ${
        (isScrollingUp && isMobile) || !isMobile
          ? "translate-y-0"
          : "translate-y-full"
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

// Utility function for throttling
function throttle(fn, wait) {
  let time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
}

export default BottomNavbar;