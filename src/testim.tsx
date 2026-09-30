import { supabase } from '@/lib/supabase'
import { Testimonials } from '@/types'

export default async function Testimonials() {
	const { data: testimonials } = await supabase
	.from('testimonials')
	.select('*')
	.limit(3)
	
	return(
	 <section className="max-w-7xl mx-auto px-6 py-20">
	     <p className="text-rose-600 text-xs font-semibold uppercase tracking-widest mb-2">What Our Client Say</p>
	     <h2 className="font-serif text-3xl mb-10">Loved by Our Community</h2>
	     
		 <div className="grid md:grid-cols-3 gap-6">
		 {testimonials?.map((t: Testimonials,i: number)=> (
		     <div key={t.id} className="animate-fade-in-up bg-rose-50 rounded-2xl p-6" style={{animationDelay: '${i*0.1}s'}}>
			 <p className="text-sm text-gray-700 mb-4">"{t.message}"</p>
             <p className="font-medium text-sm">{t.client_name}</p>
             <p className="text-rose-500 text-sm">{'*'.repeat(t.rating)}</p>


			 </div>
		 ))}
		 </div>
	 </section>
	)
	
	
}