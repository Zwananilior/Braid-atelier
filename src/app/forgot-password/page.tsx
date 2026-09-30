"use client"

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PageHero from '@/components/ui/PageHero'


export default function ForgotPasswordPage(){
     const [email, setEmail] = useState('')
     const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
     const [errorMsg, setErrorMsg] =useState('')

  	 
     const handleSubmit = async (e:React.FormEvent) =>{
		 e.preventDefault()
		 setStatus('loading')
		 setErrorMsg('')
		 
		 const {error} = await supabase.auth.resetPasswordForEmail(email, {
			 redirectTo: '${window.location.origin}/reset-password',
		 })
		 if(error){
			 setStatus('error')
			 setErrorMsg(error.message)
			 
		 }else{
			 setStatus('success')
		 }
		 
	 }

     return(
         <>
		     <PageHero 
			     eyebrow="Account" title="Fogort Password" 
				 description="Enter your email and we'll send you a link to reset it." 
				 />
				 
				 <div className="max-w-md mx-auto px-6 py-16">
				      <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
					  {status === 'success'? (
					     <div className="text-center">
						    <h2 className="font-serif text-2xl mb-2">
						      Check your Email
						    </h2>
							
							<p className="text-gray-600 text-sm">
							We've sent a password reset link to<strong>{email}</strong>.Click it to choose a new password</p>
						 </div>):(
						   <form onSubmit={handleSubmit} className="sppace-y-4">
						       <input
          							 type="email" value={email} onChange={(e) =>(e.target.value)}
                        									 placeholder="Your email address" required 
															 className="w-full border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-40 transition-shadow"
															 />
															 {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}
															 <button type="submit" disabled={status === 'loading'}
															  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 text-sm font-medium transition">
															  {status === 'loading'? 'Sending...':  'Send Reset Link'}
															  </button>
						   
						   </form>
						 
						 )}
						 
						 <p className="text-center text-sm text-gray-600 mt-6">Remember your password?{' '}
						 <Link href="/login" className="text-rose-600 font-medium hover:underline">Log in
						 </Link>
						 </p>
						 
					  </div>
				 </div>
		 </>
         		 
	 )

}
