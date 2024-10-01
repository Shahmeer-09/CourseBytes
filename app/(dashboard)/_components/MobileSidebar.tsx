import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import React from 'react'
import SidebarComp from './SidebarComp'

const MobileSidebar = () => {
  return (
    <>
    <div className=' md:hidden flex bg-white  ' >
        <Sheet>
            <SheetTrigger>
                <Menu/>
            </SheetTrigger>
            <SheetContent side={"left"} className='bg-white'  >
                <SidebarComp/>
            </SheetContent>
        </Sheet>
    </div>
    </>
  )
}

export default MobileSidebar