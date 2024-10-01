import React from "react";
import MobileSidebar from "./MobileSidebar";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import UserDropdown from "./UserDropdown";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Userbtn from "./Userbtn";
import SearchInput from "./SearchInput";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  
  return (
    <div className=" flex bg-white items-center justify-between  p-4  h-full">
      <MobileSidebar />
      <>
        <div className=" hidden md:flex   ">
          <SearchInput />
        </div>
        <div className=" w-full flex  justify-end  ">
          {user ? (
            <Userbtn
              name={user?.given_name!}
              image={user?.picture || ""}
              email={user?.email!}
            />
          ) : (
            <div className=" flex gapx-2 mr-4 ">
              <Button
                asChild
                className=" bg-blue-400 hover:bg-blue-500  transition-all"
              >
                <LoginLink>Sign-in</LoginLink>
              </Button>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default Navbar;
