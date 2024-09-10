import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineFilePdf } from "react-icons/ai";
import { RiHotelLine } from "react-icons/ri";
import { PiHandbag } from "react-icons/pi";

function BottomNavbar() {
  const navItems = [
    { icon: HiOutlineUserGroup, label: "Community", to: "" },
    { icon: MdContentCopy, label: "Notice", to: "" },
    { icon: AiOutlineFilePdf, label: "Resource", to: "" },
    { icon: RiHotelLine, label: "PG", to: "" },
    { icon: PiHandbag, label: "Job", to: "" },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 lg:left-0 lg:top-0 lg:w-[20%] lg:h-full bg-base-100 z-10 p-2 lg:p-4"
      style={{ borderRight: "1px solid gray" }}
    >
      <div className="flex justify-evenly lg:flex-col lg:items-center lg:justify-around lg:h-full lg:w-38">
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            className="btm-nav-icon text-neutral-content hover:text-primary flex flex-col items-center lg:space-x-2"
            to={to}
          >
            <Icon className="w-9 h-8" />
            <span className="text-xs lg:text-lg font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BottomNavbar;
