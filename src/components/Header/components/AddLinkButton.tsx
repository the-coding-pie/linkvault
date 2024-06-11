import AddLinkModal from "@/components/modals/AddLinkModal/AddLinkModal";
import EmailVerifyModal from "@/components/modals/EmailVerifyModal/EmailVerifyModal";
import { Button } from "@/components/ui/button";
import { User } from "lucia";
import { PlusIcon } from "lucide-react";

interface Props {
  user: User;
}

const AddLinkButton = ({ user }: Props) => {
  return (
    <div>
      {!user ? (
        <Button variant={"ghost"}>
          <PlusIcon className="mr-2 h-4 w-4" /> Submit Link
        </Button>
      ) : user.emailVerified ? (
        <AddLinkModal>
          <Button variant={"ghost"}>
            <PlusIcon className="mr-2 h-4 w-4" /> Submit Link
          </Button>
        </AddLinkModal>
      ) : (
        <EmailVerifyModal user={user}>
          <Button variant={"ghost"}>
            <PlusIcon className="mr-2 h-4 w-4" /> Submit Link
          </Button>
        </EmailVerifyModal>
      )}
    </div>
  );
};
export default AddLinkButton;
