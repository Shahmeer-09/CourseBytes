import React from "react";
import Logo from "./Logo";
import SidebarNavigations from "./SidebarNavigations";

const SidebarComp = () => {
  return (
    <div className=" h-full flex flex-col gap-y-4   overflow-y-scroll  scrollbar-hide    ">
      <div>
        <Logo />
      </div>
      <div>
        <SidebarNavigations />
      </div>
    </div>
  );
};

export default SidebarComp;
