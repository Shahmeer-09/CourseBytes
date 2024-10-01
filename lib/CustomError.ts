

export const MyRsponse  = (msg:string, success:boolean, data:any)=>{

   return {message:msg, success:success, data:data}
}
export const MyError  = (error:Error)=>{
   return {message:error.message}
}