// src/BottomNavbar.js
import React from "react";
import { Link } from "react-router-dom";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdContentCopy } from "react-icons/md";
import { PiHandbag } from "react-icons/pi";
import { RiHotelLine } from "react-icons/ri";

import { AiOutlineFilePdf } from "react-icons/ai";


function BottomNavbar() {
  return (
    <div className="btm-nav fixed inset-x-0 bottom-0 bg-black rounded-lg border-t border-gray-200 z-10 gap-3 justify-evenly">
      <Link className="btm-nav-icon text-white hover:text-primary" to="">
        <HiOutlineUserGroup className="w-10 h-8" />
        <span className="text-sm">Community</span>
      </Link>

      <Link className="btm-nav-icon text-white hover:text-primary" to="">
        <MdContentCopy  className="w-10 h-8" />
        <span className="text-sm">Notice</span>
      </Link>

      <Link className="btm-nav-icon text-white hover:text-primary"to="">
        <AiOutlineFilePdf className="w-10 h-8" />
        <span className="text-sm">Resource</span>
      </Link>

      <Link className="btm-nav-icon text-white hover:text-primary" to="">
        <RiHotelLine className="w-10 h-8" />
        <span className="text-sm">PG</span>
      </Link>

      <Link className="btm-nav-icon text-white hover:text-primary" to="">
        <PiHandbag className="w-10 h-8" />
        <span className="text-sm">Job</span>
      </Link>
    </div>
  );
}

export default BottomNavbar;
