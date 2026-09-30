import Link from 'next/link'
import { CalendarDays, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react'


const bookingSteps = [
{icon: CalendarDays, title: 'Select Service', subtitle: '& Date',
},
{
icon: CreditCard, title: 'Confirm', subtitle: 'Details',
},
{
icon: CheckCircle2, title: 'Get', subtitle: 'Confirmation',
},
]



export default function CtaBanner() {
	
	
	return(
	  <section className="bg-rose-900 text-white py-16">
	     <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
		     <div className="mt-7">
			     <p className="text-xs uppercase tracking-widest text-rose-300mb-2">
				 Ready for a New Look?
				 </p>
				 
				 <h2 className="font-serif text-3xl mb-2">Book Your appointment Today</h2>
				 <p className="text-rose-200 text-sm">
				  Quick. Easy. Secure. Choose your service, pick a date and let us take care of the rest.
				 </p>
			 
			<div className="mt-7">
			 
			 <Link href="/booking" className="bg-rose-500 hover:bg-rose-400 px-6 py-3 rounded-full text-sm font-medium-transition-colors whitespace-nowrap">
			 Book Now →
			 </Link>
			</div> 
			</div>
			 
			 
			 <div className="flex items-center justify-center lg:min-w-[50px]">
			 {bookingSteps.map((step, index) => {
				 const Icon = step.icon
				 
				 return(
				    <div key={step.title} className="flex items-center">
					    <div className="flex min-w-[110px] flex-col items-center text-center">
						   <Icon size={28} strokeWidth={1.5} className="mb-3 text-white" />
						   <p className="text-xs font-medium text-white">{step.title}</p>
						   <p className="text-xs text-rose-200 ">{step.subtitle}</p>
						   
						   
						</div>
						{index <bookingSteps.length - 1 &&(
						<div className="mx-4 h-12 w-px bg-white/20"/>
						)}
						
					</div>
				 )
			 })}
			 
			 </div>
			 
		 </div>
		 
	  </section>
	)
	
}
