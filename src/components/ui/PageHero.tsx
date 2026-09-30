export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <section className="bg-rose-50 py-16 text-center animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-rose-600 text-xs font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
    </section>
  )
}