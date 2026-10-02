import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-rose-50 px-6">
      <div className="animate-fade-in-up text-center max-w-md">
        <p className="text-rose-600 text-center font-semibold uppercase tracking-widest mb-3">
          404
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or may have moved. Let us get you
          back to something beautiful.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/services"
            className="border border-gray-300 hover:border-rose-400 px-6 py-3 rounded-full text-sm font-medium transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </section>
  )
}
