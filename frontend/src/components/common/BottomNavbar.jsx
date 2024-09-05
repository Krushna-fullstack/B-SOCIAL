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
    <div className="btm-nav fixed inset-x-0 bottom-0 bg-base-100 z-10 flex justify-evenly p-2">
      {navItems.map(({ icon: Icon, label, to }) => (
        <Link
          key={label}
          className="btm-nav-icon text-neutral-content hover:text-primary flex flex-col items-center"
          to={to}
        >
          <Icon className="w-8 h-8" />
          <span className="text-xs">{label}</span>
        </Link>
      ))}
    </div>
  );
}

export default BottomNavbar;
