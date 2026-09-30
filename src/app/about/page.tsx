import PageHero from '@/components/ui/PageHero'

const values = [
  { title: 'Skilled Stylists', desc: 'Every stylist is trained, experienced and passionate about braiding and loc care.' },
  { title: 'Premium Products', desc: 'We use quality, hair-friendly products that protect your scalp and strands.' },
  { title: 'Clean Environment', desc: 'A relaxed, hygienic space where you can unwind while we work.' },
  { title: 'Personalised Service', desc: 'We listen first — every style is tailored to your hair type and lifestyle.' },
]

const team = [
  { name: 'Lindiwe N.', role: 'Founder & Lead Stylist', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80' },
  { name: 'Ayanda P.', role: 'Loc Specialist', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Bongiwe T.', role: 'Braid Artist', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="More Than Just Hair"
        description="The Braid Atelier was founded to give every client a space where braids, locs and natural hair are celebrated."
      />

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-in-up aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=800&q=80"
            alt="Salon interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="animate-fade-in-up animate-delay-1">
          <h2 className="font-serif text-3xl mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            What started as a small home-based braiding service has grown into a full
            atelier dedicated to protective styling. We believe braids and locs are more
            than a hairstyle — they're an expression of identity and confidence.
          </p>
          <p className="text-gray-600">
            Today, our team works with clients of every hair type and texture, combining
            traditional techniques with modern trends to bring your vision to life.
          </p>
        </div>
      </section>

      <section className="bg-rose-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-center mb-10">Why Choose Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="animate-fade-in-up bg-white rounded-xl p-6 text-center"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <h3 className="font-medium mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl text-center mb-10">Meet the Team</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="animate-fade-in-up text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-square rounded-full overflow-hidden mb-4 max-w-[180px] mx-auto">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-rose-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}