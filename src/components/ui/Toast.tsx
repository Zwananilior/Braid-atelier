"use client"

export default function Toast ({ message, show }: {message: string; show: boolean}){
     return(
	     <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      >
	  {message}
	  </div>
	 )
}