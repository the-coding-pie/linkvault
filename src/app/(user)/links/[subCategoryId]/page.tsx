import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getLinks } from "@/services/links";
import validateRequest from "@/lib/auth/validateRequest";
import LinkCard from "@/components/LinkCard/LinkCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import paginate, { DOTS } from "@/lib/paginate";
import { PAGINATION_LIMIT } from "@/configs";

interface Props {
  params: {
    subCategoryId: string;
  };
  searchParams: {
    page?: string;
  };
}

const Links = async ({
  params: { subCategoryId },
  searchParams: { page },
}: Props) => {
  const { user } = await validateRequest();

  const currentPage = (page ? parseInt(page) : 1) || 1;

  const { links, totalResults, subCategory } = await getLinks(
    subCategoryId,
    currentPage
  );

  const pages = paginate({
    totalCount: totalResults,
    currentPage: currentPage,
    pageSize: PAGINATION_LIMIT,
  });

  return (
    <div className="page">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${subCategory.category?.id}`}>
              {subCategory.category?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subCategory.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="links">
        {links.length > 0 ? (
          <>
            <div className="links flex flex-col gap-4">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  user={user}
                  revalidatePathKeys={
                    currentPage === 1
                      ? [
                          `/links/${link.subCategoryId}`,
                          `/links/${link.subCategoryId}?page=1`,
                        ]
                      : [`/links/${link.subCategoryId}?page=${currentPage}`]
                  }
                />
              ))}
            </div>

            <Pagination className="mt-8">
              <PaginationContent>
                {pages.map((page) =>
                  page === DOTS ? (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`?page=${page}`}
                        isActive={currentPage == parseInt(page) ? true : false}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <p>No links found</p>
        )}
      </section>
    </div>
  );
};

export default Links;
