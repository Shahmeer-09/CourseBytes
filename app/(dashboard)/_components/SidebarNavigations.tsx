"use client"
import { BarChart4, Compass  , LayoutDashboard, List } from "lucide-react";
import React from "react";
import NavlinkItem from "./NavlinkItem";
import { usePathname } from "next/navigation";

const navlinks = [
  {
    Icon: LayoutDashboard,
    href: "/",
    name: "Dashbord",
  },
  {
    Icon: Compass,
    href: "/search",
    name: "Browse",
  },
];


const TeachermodeNav=[
  {
    Icon: List,
    href: "/teacher/courses",
    name: "Courses",
  },
  {
    Icon: BarChart4,
    href: "/teacher/analytics",
    name: "Analytics",
  },
]
const SidebarNavigations = () => {
  const pathname = usePathname();
  const isTEacher = pathname.includes("/teacher");
  const navitem = isTEacher ? TeachermodeNav :  navlinks;

  return (
    <>
      {navitem.map((item) => (
        <NavlinkItem
          key={item.href}
          url={item.href}
          name={item.name}
          iconnav={item.Icon}
        />
      ))}
    </>
  );
};

export default SidebarNavigations;
