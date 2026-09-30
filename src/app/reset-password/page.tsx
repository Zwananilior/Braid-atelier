"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PageHero from '@/components/ui/PageHero'

export default function ResetPasswordPage(){

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
const [errorMsg, setErrorMsg] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
	  setForm({...form, [e.target.name]: e.target.value})
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault()
	  setErrorMsg('')
	  
	  if(form.newPassword.length < 6){
		  setErrorMsg('Password muct be at least 6 characters.')
	       return
	  }
	  if(form.newPassword !== form.confirmPassword){
		  setErrorMsg('Passwords do not match.')
         return	 
	 }
	 setStatus('loading')
	 const { error } = await supabase.auth.updateUser({ Password: form.newPassword })
	 
	 if(error){
		 setStatus('error')
		 setErrorMsg(error.message)
	 }else{
		 setStatus('success')
		 setTimeout(() => router.push('/'), 2500)
	 }
	  
  }
        return(
         <>
		     <PageHero eyobrow="Account" title="Reset Password" description="Choose a new password for your account."/>
			     <div className="max-w-md mx-auto px-6 py-16">
			         <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
					   {status === 'success' ? (
					    <div className="text-center">
						 <h2 className="font-serif text-2xl mb-2">Password updated!</h2>
						  <p className="text-gray-600 text-sm">Taking you to the homepage...</p>
						</div>):(
						<form onSubmit={handleSubmit} className="space-y-4">
						    
							<input type="password" name="newPassword" placeholder="New Password(min 6 characters)" value={form.newPassword}
							onChange={handleChange} required minLength={6}
							className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
							/>
							
							<input type="password" name="confirmPassword" placeholder="Confirm New Password" value={form.confirmPassword}
							onChange={handleChange} required minLength={6} 
							className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
							/>
							{errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
						     <button type="submit" disabled={status == 'loading'} 
							 className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 px-3 rounded-full text-sm font-medium transition-colors">
							    {status == 'loading'? 'Updateing...' : 'Updating Password'}
							 </button>	
						</form>
						)}
						
					 </div>
			     </div>
		 </>
         
         
        )

}
