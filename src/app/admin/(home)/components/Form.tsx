"use client";
import acceptTempLink from "@/actions/links/acceptTempLink";
import rejectTempLink from "@/actions/links/rejectTempLink";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  tempLink: {
    category: string;
    subCategory: string;
    id: number;
    title: string;
    url: string;
    description: string | null;
    categoryNew: boolean;
    subCategoryNew: boolean;
    createdAt: Date;
    updatedAt: Date;
    postedBy: {
      email: string;
      name: string;
      id: number;
      username: string;
    } | null;
  };
  categories: { id: number; name: string }[];
  subCategories: { id: number; name: string }[];
}

const Form = ({ tempLink, categories, subCategories }: Props) => {
  const [finalTitle, setFinalTitle] = useState(tempLink.title);
  const [finalDescription, setFinalDescription] = useState(
    tempLink.description || ""
  );
  const [finalUrl, setFinalUrl] = useState(tempLink.url);
  const [finalCategoryName, setFinalCategoryName] = useState(
    tempLink.categoryNew ? tempLink.category : ""
  );
  const [finalSubCategoryName, setFinalSubCategoryName] = useState(
    tempLink.subCategoryNew ? tempLink.subCategory : ""
  );

  const handleAccept = useCallback(async () => {
    // TODO: call acceptTempLink
    const res = await acceptTempLink({
      id: tempLink.id,
      title: finalTitle,
      description: finalDescription,
      category: tempLink.categoryNew ? finalCategoryName : tempLink.category,
      subCategory: tempLink.subCategoryNew
        ? finalSubCategoryName
        : tempLink.subCategory,
      categoryNew: tempLink.categoryNew,
      subCategoryNew: tempLink.subCategoryNew,
      createdAt: tempLink.createdAt,
      url: finalUrl,
      userId: tempLink.postedBy?.id,
    });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  }, [
    finalTitle,
    finalDescription,
    tempLink,
    finalUrl,
    finalCategoryName,
    finalSubCategoryName,
  ]);

  const handleReject = useCallback(async () => {
    const res = await rejectTempLink({ id: tempLink.id });

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  }, [tempLink]);

  return (
    <div
      key={tempLink.id}
      className="p-2 bg-white shadow-md flex flex-col gap-4 border"
    >
      <div>
        <input
          type="text"
          className="border-2 p-2 font-semibold w-full"
          placeholder="Title"
          value={finalTitle}
          onChange={(e) => setFinalTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          className="border-2 p-2 font-semibold w-full"
          placeholder="Description"
          value={finalDescription}
          onChange={(e) => setFinalDescription(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="border-2 p-2 font-medium w-full"
          placeholder="URL"
          value={finalUrl}
          onChange={(e) => setFinalUrl(e.target.value)}
        />
      </div>
      <div className="posted-by text-sm">
        <span>Posted By: </span> {tempLink.postedBy?.username}
      </div>

      <div className="cat text-sm font-semibold flex items-center gap-4">
        <div className="cat">
          <span className="flex items-center gap-2">
            Category:{" "}
            {tempLink.categoryNew ? (
              <div>
                <input
                  type="text"
                  className="border-2 p-2"
                  placeholder="New name for Category"
                  value={finalCategoryName}
                  onChange={(e) => setFinalCategoryName(e.target.value)}
                />
              </div>
            ) : (
              categories.find((c) => c.id === parseInt(tempLink.category))?.name
            )}
          </span>
        </div>
        <div className="cat-new">
          <span>Category New: {tempLink.categoryNew ? "✅" : "❌"}</span>
        </div>
      </div>
      <div className="sub text-sm font-semibold flex items-center gap-4 mb-2">
        <div className="sub">
          <span className="flex items-center gap-2">
            SubCategory:{" "}
            {tempLink.subCategoryNew ? (
              <div>
                <input
                  type="text"
                  className="border-2 p-2"
                  placeholder="New name for Sub Category"
                  value={finalSubCategoryName}
                  onChange={(e) => setFinalSubCategoryName(e.target.value)}
                />
              </div>
            ) : (
              subCategories.find((c) => c.id === parseInt(tempLink.subCategory))
                ?.name
            )}
          </span>
        </div>
        <div className="sub-new">
          <span>SubCategory New: {tempLink.categoryNew ? "✅" : "❌"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-green-600" onClick={handleAccept}>
          Accept
        </button>
        <button className="text-red-600" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};
export default Form;
