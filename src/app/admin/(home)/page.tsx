import { db } from "@/lib/db";
import Form from "./components/Form";

const AdminHome = async () => {
  const tempLinks = await db.tempLink.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    select: {
      category: true,
      categoryNew: true,
      postedBy: {
        select: {
          email: true,
          name: true,
          id: true,
          username: true,
        },
      },
      subCategory: true,
      subCategoryNew: true,
      updatedAt: true,
      createdAt: true,
      description: true,
      id: true,
      title: true,
      url: true,
    },
  });

  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const subCategories = await db.subCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="container mt-8 flex flex-col gap-4 min-h-screen">
      {tempLinks.length > 0 ? (
        tempLinks.map((link) => (
          <Form
            key={link.id}
            tempLink={link}
            categories={categories}
            subCategories={subCategories}
          />
        ))
      ) : (
        <p>No link submissions :(</p>
      )}
    </div>
  );
};

export default AdminHome;
