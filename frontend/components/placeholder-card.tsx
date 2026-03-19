type PlaceholderCardProps = {
  title: string;
  description: string;
};


export function PlaceholderCard({ title, description }: PlaceholderCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
