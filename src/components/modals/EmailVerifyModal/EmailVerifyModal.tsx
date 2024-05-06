"use client";
import { useCallback, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucia";
import { Button } from "@/components/ui/button";
import resendVerifyEmail from "@/actions/auth/resendVerifyEmail";
import toast from "react-hot-toast";
import { MailOpenIcon } from "lucide-react";

interface Props {
  children: JSX.Element;
  user: User;
}

const EmailVerifyModal = ({ children, user }: Props) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleResendVerification = useCallback(() => {
    startTransition(async () => {
      const res = await resendVerifyEmail();

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader></DialogHeader>

        <div className="content flex flex-col items-center justify-center text-center gap-4">
          <div className="bg-green-400 p-4 rounded-full w-max h-max">
            <MailOpenIcon />
          </div>
          <h3 className="text-xl font-semibold">Please verify your Email</h3>

          <p className="text-gray-600 text-sm">
            You&apos;re almost there! We sent an email to{" "}
            <strong>{user.email}</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Just click on the link in that email to complete your signup. If you
            don&apos;t see it, you may need to <strong>check your spam</strong>{" "}
            folder.
          </p>

          <p className="text-gray-600 text-sm">
            Still can&apos;t find the email? No problem.
          </p>
        </div>

        <Button onClick={handleResendVerification} disabled={isPending}>
          Resend Verification email
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default EmailVerifyModal;
