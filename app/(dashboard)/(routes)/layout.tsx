import React from "react";
import SidebarComp from "../_components/SidebarComp";
import Navbar from "../_components/Navbar";
import Container from "../_components/Container";
import { ThemeProvider } from "@/components/theme-provider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className=" hidden fixed top-0 left-0 bg-white md:flex h-full flex-col w-56 border-r z-50   shadow-sm   ">
        <SidebarComp />
      </div>
      <div className="fixed inset-y-0 h-[60px] w-svw  md:pl-56  border-b shadow-sm">
        <Navbar />
      </div>
      <Container>
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </Container>
    </div>
  );
};

export default layout;
