"use client";

type SubscribedCategoriesProps = {
  categories: string[];
};

export default function SubscribedCategories({ categories }: SubscribedCategoriesProps) {
  return (
    <div className="mt-6">

      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-(--surface) text-(--text-main) rounded-full text-sm font-medium cursor-pointer hover:bg-(--focus) hover:text-(--white) transition"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
