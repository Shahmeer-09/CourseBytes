
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface userinfoprop{
  name :string | null,
  email:string | null,
  image:string 
}
export default function UserDropdown({name, email , image}:userinfoprop) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger   asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full relative h-8 w-8"
        
        >
          
          <Avatar className=" h-8 w-8 ">
             <AvatarImage src={image}/>
            <AvatarFallback className=" bg-blue-600 text-white text-xs "  >{name?.slice(0,3)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem className="flex flex-col space-y-2  items-start ">
          <p className="font-bold leading-none ">{name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {email}
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>
          <LogoutLink>Logout</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
