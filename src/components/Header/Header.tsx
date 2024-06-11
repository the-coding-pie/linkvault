import validateRequest from "@/lib/auth/validateRequest";
import RegisterModal from "../modals/RegisterModal/RegisterModal";
import { Button } from "../ui/button";
import LoginModal from "../modals/LoginModal/LoginModal";
import Link from "next/link";
import Profile from "./components/Profile";
import AddLinkButton from "./components/AddLinkButton";

const Header = async () => {
  const { user, session } = await validateRequest();

  return (
    <header className="header fixed top-0 bg-white border-b left-0 right-0 w-full z-30">
      <div className="container h-[62px] flex items-center justify-between">
        <div className="left">
          <Link href={"/"}>Listed.sh</Link>
        </div>
        <div className="right flex items-center justify-end gap-4">
          {session ? (
            <>
              <AddLinkButton user={user!} />
              <Profile user={user!} />
            </>
          ) : (
            <>
              <LoginModal>
                <AddLinkButton user={user!} />
              </LoginModal>
              <RegisterModal>
                <Button>Sign Up</Button>
              </RegisterModal>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
