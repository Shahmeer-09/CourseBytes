

import React from "react";


import { columns } from "./_components/columns"
import { DataTable } from "./_components/DataTable"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
 
 const getCourses = async(userid:string)=>{
  try {
    const data = await prisma.course.findMany({
      where:{
        userId:userid
      }
      ,orderBy:{
        createdAt:"desc"
      }
    })
    return data
  } catch (error) {
    return []
  }
  
}
const Teacherpage =async () => {
    const {getUser} = getKindeServerSession()
    const user = await getUser()
    if(!user){
      return redirect('/')
    }
    const coursedata = await getCourses(user?.id)
    
  return (
    <div className=" p-6 h-full " >
          <DataTable data={coursedata} columns={columns} />
    </div>
  );
};
export default Teacherpage;
