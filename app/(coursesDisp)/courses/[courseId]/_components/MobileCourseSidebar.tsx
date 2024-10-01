import React from 'react'
import { Chapters, Course, UserProgress } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import CourseSidebar from './CourseSidebar';

interface navbarcourses {
    course: Course & {
      chapters: (Chapters & { userProgress: UserProgress[] | null })[];
    };
    progressCount: number | undefined;
  }

const MobileCourseSidebar = ({course,progressCount}:navbarcourses) => {
  return (
     <Sheet>
        <SheetTrigger className=' md:hidden hover:opacity-70  ' >
           <Menu/>
        </SheetTrigger>
        <SheetContent side={"left"}  className=' p-0  bg-white w-72 ' >
           <CourseSidebar course={course} progressCount={progressCount}/>
        </SheetContent>
     </Sheet>
  )
}

export default MobileCourseSidebar