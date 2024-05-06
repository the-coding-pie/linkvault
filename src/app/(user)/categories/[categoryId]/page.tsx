import { getSubCategories } from "@/services/subs";
import { FileTextIcon } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  params: {
    categoryId: string;
  };
}

const SubCategories = async ({ params: { categoryId } }: Props) => {
  const { subCategories, category } = await getSubCategories(categoryId);

  return (
    <div className="page">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/#categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="all-subcategoreis">
        <div className="header mb-4">
          <h2 className="text-xl font-bold">Sub Categories</h2>
        </div>
        {subCategories.length > 0 ? (
          <div className="categories flex flex-wrap items-center gap-6">
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/links/${sub.id}`}
                className="flex gap-3 cursor-pointer border px-4 py-3 rounded"
              >
                <FileTextIcon className="w-6 h-6 bg-blue-200" />

                <span className="font-medium">{sub.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No sub categories found</p>
        )}
      </section>
    </div>
  );
};
export default SubCategories;
