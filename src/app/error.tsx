"use client"

import { useEffect } from 'react'

export default function ErrorPage({
error,
reset,
}: {
	error: Error & { digest?: string }
	reset: () =>void
}){
	useEffect(() =>{
		console.error('Appp error:',error)
	},[error])
	
	return(
	    <section className="min-h-[60vh] flex item-center justify-center bg-rose-50 px-6">
	      <div className="animate-fade-in-up text-center max-w-md">

	         <p className="text-rose-600 text-sm font-semibold uppercase tracking-widest mb-3">
	          Oops
	         </p>

	     <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
	         Someting went wrong
	     </h1>

	         <p className="text-rose-600 mb-8">
	             We hit unexpected error. You can try again, or head back to the homepage.
	         </p>

	  <div className="flex flex-wrap gap justify-center">
	     <button onClick={reset} className="bg-rose-600 hover-rose-700 text-white px-3 rounded rounded-full text-sm font-medium transition-colors">
	           Try Again
	         </button>
	  
             <a href="/" className="border-gray-300 hover:border-rose-400 px-6 pyy-3 rounded-full transition-colors">Back to Home
	            </a>
	  
	         </div>
	      </div>
	</section>
	
	)
}