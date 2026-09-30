import Hero from '@/components/home/Hero'
import ServicesGrid from '@/components/home/ServicesGrid'
import  Testimonials from '@/components/home/Testimonials'
import CtaBanner from '@/components/home/CtaBanner'
import GallerySection from '@/components/home/GallerySection'


export default function HomePage() {
	 return(
	    <>
		<Hero/>
		<ServicesGrid/>
		<GallerySection/>
		<Testimonials/>
		<CtaBanner/>
		</>
	)
}