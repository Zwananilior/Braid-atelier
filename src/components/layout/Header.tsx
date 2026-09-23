"use client"

import Link from 'next/Link'
import { usePathname } from 'next/naviggation'
import { useState } from 'react'

const navLinks = [
     {href: '/',label:'Home'},
	 {href: '/services',label:'Services'}, 
	 {href: '/gallery',label:'Gallery'},
	 {href: '/about',label:'About'},
	 {href: '/reviews',label:'Reviews'},
	 {href: '/contact',label:'Contact'},
]

export default function Header() {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	
	return(
     <header className="sticky top-0 z-50 bg-rose-50/90 backdrop-blur border-b border-rose-100">
	     <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
	         <Link href="/" className="font-serif text-2xl text-rose-900">
			     The Braid Atelier
			 </Link>
			 
			 {/*Desktop navigation*/}
			  <nav className="hidden md:flex gap-8 text-sm font-medium">
			     {navLinks.map((link) =>{
					 const active = pathname === link.href
					     return(
                          <Link 
						  key={link.href}
						  href={link.href}
						  className={'relative pb-1 transition-colors duration-200 ${active ? 'text-rose-600' : 'text-gray-700 hover:text-rose-500'
						  }'}
						  >
						  {link.label}
						  <span 
						       className={'absolute left-0 -bottom-0.5 h-0.5 bg-rose-500 transition-all duration-300 ${
								   active ? 'w-full'
							   }'}/>
						  </Link>						
 						)
						
					 )}}
			     </nav>
			     
				 <div className='hidden md:block'>
				     <Link 
					  href="/booking">Book Now</Link>
				 </div>
				 
				 {/*/Toggle*/}
				 <button
				        className='md:hidden flex flex-col gap-1.5'
						         onClick={() =>setMenuOpen(!menuOpen)} aria-label="Toggle menu">
								   <span className={'block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}'}/>
                                   <span className={'block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}'}/>
                                    <span className={'block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}'}/>
 
									</button>
			  
	     </div>
		 
		 {/*nav*/}
		 <div className={'md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}'}>
		 
		     <nav className="flex flex-col gap-4 px-pb-6 ">
			     {navLinks.map((link) => (
				         <Link key={link.href} onClick={() =>setMenuOpen(false)} className={'text-sm font-medium ${pathname === link.href ? 'text-rose-600': 'text-gray-700'}'}>{link.label}
					     </Link>
				 ))}
				 <Link href="/booking" onClick={() =setMenuOpen(false)} className="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-medium text-center">Book Now
				 </Link>
				 
			 </nav>
		 </div>
		 
	 </header>
      
     
	)
}