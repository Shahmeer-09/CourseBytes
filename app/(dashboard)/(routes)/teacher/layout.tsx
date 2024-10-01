import { IsTeacher } from '@/lib/AdminFilter';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const layout =async ({children}:{children:React.ReactNode}) => {
    const { getUser } = getKindeServerSession();
    const user =await getUser();
    const isadmin = IsTeacher(user.id.toString());
    if(!isadmin){
        return redirect('/')
    }
  return (
    <div>{children}</div>
  )
}

export default layout