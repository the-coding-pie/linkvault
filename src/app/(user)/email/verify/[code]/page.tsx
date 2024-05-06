import validateRequest from "@/lib/auth/validateRequest";
import { notFound } from "next/navigation";
import VerifyEmailPage from "./components/VerifyEmailPage";

interface Props {
  params: {
    code: string;
  };
}

const VerifyEmail = async ({ params: { code } }: Props) => {
  const { session, user } = await validateRequest();

  if (!session) {
    return notFound();
  }

  if (user.emailVerified) {
    return <div>Email already verified</div>;
  }

  return <VerifyEmailPage code={code} />;
};

export default VerifyEmail;
