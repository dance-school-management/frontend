export function DanceCategoryBadge({ category }: { category: string; }) {
  return (
    <span className='px-3 py-1 text-xs font-bold rounded-sm bg-primary/10 text-primary'>
      {category}
    </span>
  );
}