import validateRequest from "@/lib/auth/validateRequest";
import { getCategories } from "@/services/categories";
import { Folder } from "lucide-react";
import Link from "next/link";

const Home = async () => {
  const { user } = await validateRequest();
  const { categories } = await getCategories();
  // const { topLinks } = await getTopLinks();

  return (
    <div className="page">
      {/* <section className="top-links mb-16">
        <h2 className="text-xl font-bold mb-4">
          Top Links{" "}
          <TrendingUpIcon className="inline-block ml-2 text-green-500" />
        </h2>

        <div className="links">
          {topLinks.length > 0 ? (
            <>
              <div className="links flex flex-col gap-4">
                {topLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    user={user}
                    revalidateTagKey="topLinks"
                    category={link.subCategory.category}
                    subCategory={link.subCategory}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>No links found</p>
          )}
        </div>
      </section> */}

      <section className="all-categories">
        <div className="header mb-4">
          <h2 className="text-xl font-bold">All Categories</h2>
        </div>

        {categories.length > 0 ? (
          <div
            id="categories"
            className="categories flex flex-wrap items-center gap-6"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="flex gap-3 cursor-pointer border px-4 py-3 rounded-md bg-white shadow-sm items-center"
              >
                <div className="bg-purple-100 p-1 rounded-md">
                  <Folder className="w-6 h-6 text-purple-400" />
                </div>

                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No categories found</p>
        )}
      </section>
    </div>
  );
};

export default Home;
