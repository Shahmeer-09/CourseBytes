import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'


const page = async({params}:{params:{courseId:string}}) => {
    
    const course = await prisma.course.findUnique({
        where:{
            id:params.courseId
        },
        include:{
         chapters:{
            where:{
                isPublished:true
            },
            orderBy:{
                position:"asc"
            },
            select:{
                id:true,
            }
         }
        }
    }) 
    const chapId = course?.chapters.map(id=>id)
     const firstchap = chapId?.[0].id
   if(!course?.id){
    return redirect('/')
   }
   return redirect (`/courses/${params.courseId}/chapters/${firstchap}`)
}

export default page