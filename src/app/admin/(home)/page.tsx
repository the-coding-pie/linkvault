import { getTempLinks } from "@/services/tempLinks";

const AdminHome = async () => {
  const tempLinks = await getTempLinks();

  return (
    <div className="container mt-8">
      {tempLinks.links.map((link) => (
        <div className="p-2">
          <h2 className="text-lg font-medium">{link.title}</h2>
          <div className="flex items-center gap-2">
            <button className="text-green-600">Accept</button>
            <button className="text-red-600">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHome;
