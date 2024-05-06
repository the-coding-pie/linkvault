export interface CategoryObj {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryObj {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

export interface LinkObj {
  votes: number[];
  createdAt: string;
  description: string;
  id: number;
  postedBy: {
    id: number;
    username: string;
    profile: string;
  };
  subCategoryId: number;
  title: string;
  url: string;
}

export interface LinkWithCategoryAndSubObj
  extends Omit<LinkObj, "subCategoryId"> {
  subCategory: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  };
}

export interface CategoriesWithSubsObj extends CategoryObj {
  subCategories: SubCategoryObj[];
}
