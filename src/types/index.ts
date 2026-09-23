export interface Service {
     id: string 
	 name: string
	 description: string | null
	 price_from: number
	 image_url: string | null
	 category: string | null
	 created_at: string
	     
}

export interface GalleryImage { 
     id: string
	 image_url: string
	 caption: string
	 created_at: string
     
}

export interface Testimonial { 
     id: string
	 client_name: string
	 message: string
	 rating: number
	 avatar_url: string | null
	 created_at: string
}

export interface Booking { 
     id: string
	 client_name: string
	 email: string
	 phone: string | null
	 service_id: string
	 preferred_date: string 
	 preferred_time: string
	 notes: string | null
	 status: string
	 created_at: string
}