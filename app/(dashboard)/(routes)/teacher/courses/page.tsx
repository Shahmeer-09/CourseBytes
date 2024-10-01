import { Button } from "@/components/ui/button";


import React from "react";


import { columns } from "./_components/columns"
import { DataTable } from "./_components/DataTable"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
 
export const getCourses = async(userid:string)=>{
  const data = await prisma.course.findMany({
    where:{
      userId:userid
    }
    ,orderBy:{
      createdAt:"desc"
    }
  })
  return data
}
const Teacherpage =async () => {
    const {getUser} = getKindeServerSession()
    const user = await getUser()
    const coursedata = await getCourses(user?.id)

  return (
    <div className=" p-6 h-full " >
          <DataTable data={coursedata} columns={columns} />
    </div>
  );
};
export default Teacherpage;
