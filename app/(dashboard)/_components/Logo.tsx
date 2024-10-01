import Image from "next/image";
import React from "react";

const Logo = () => {
  return <Image alt="logo" height={26} width={180} src="/logo.svg"  className="p-6" />;
};

export default Logo;
