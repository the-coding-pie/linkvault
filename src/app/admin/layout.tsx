import validateRequest from "@/lib/auth/validateRequest";
import { notFound } from "next/navigation";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { session, user } = await validateRequest();

  if (!session || !user?.isAdmin) {
    notFound();
  }

  return <div className="bg-blue-50">{children}</div>;
};

export default AdminLayout;
