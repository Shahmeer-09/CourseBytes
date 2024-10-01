import React from 'react'

function Container({children}:{children:React.ReactNode}) {
  return (
    <div className=' md:pl-56  w-full  mt-[60px]  h-[100vh]' >{children}</div>
  )
}

export default Container