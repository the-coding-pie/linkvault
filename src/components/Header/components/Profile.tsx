"use client";
import logout from "@/actions/auth/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import trimText from "@/lib/trimText";
import { User } from "lucia";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

const Profile = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      const res = await logout();

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.profile} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[200px] max-w-[200px]"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p
              className="font-medium leading-none text-ellipsis"
              title={user.username.length > 20 ? user.username : ""}
            >
              u/{trimText(user.username, 20)}
            </p>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={"/profile"}>Profile</Link>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-red-500 focus:bg-red-100 focus:text-red-500 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Profile;
