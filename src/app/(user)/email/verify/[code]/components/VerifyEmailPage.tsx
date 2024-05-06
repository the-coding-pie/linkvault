"use client";

import verifyEmail from "@/actions/auth/verifyEmail";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  code: string;
}

const VerifyEmailPage = ({ code }: Props) => {
  const [_, startTransition] = useTransition();

  const router = useRouter();

  const [error, setError] = useState("");

  const handleEmailVerification = useCallback((code: string) => {
    startTransition(async () => {
      const res = await verifyEmail(code);

      if (res.success) {
        toast.success(res.message);

        // redirect user to homepage
        router.push("/");
      } else {
        setError(res.message);
      }
    });
  }, []);

  useEffect(() => {
    handleEmailVerification(code);
  }, []);

  if (error) {
    return (
      <div>
        {error}
        {error !== "Invalid code" && (
          <Button onClick={() => handleEmailVerification(code)}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div>Verifying</div>
    </div>
  );
};

export default VerifyEmailPage;
