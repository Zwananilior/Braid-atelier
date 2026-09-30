import Link from 'next/link'


export default function CtaBanner() {
	
	
	return(
	  <section className="bg-rose-900 text-white py-16">
	     <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
		     <div>
			     <p className="text-xs uppercase tracking-widest text-rose-300mb-2">
				 Ready for a New Look?
				 </p>
				 
				 <h2 className="font-serif text-3xl mb-2">Book Your appointment Today</h2>
				 <p className="text-rose-200 text-sm">
				  Quick. Easy. Secure. Choose your service, pick a date and let us take care of the rest.
				 </p>
			 </div>
			 
			 <Link href="/booking" className="bg-rose-500 hover:bg-rose-400 px-6 py-3 rounded-full text-sm font-medium-transition-colors whitespace-nowrap">
			 Book Now →
			 </Link>
			 
		 </div>
	  </section>
	)
	
}
