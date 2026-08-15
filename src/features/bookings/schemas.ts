import { z } from 'zod'

export const bookingEnquirySchema = z
  .object({
    guestName: z.string().min(2, 'Enter your full name'),
    guestEmail: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    guestPhone: z.string().min(7, 'Enter a valid phone number'),
    checkIn: z.string().min(1, 'Select a check-in date'),
    checkOut: z.string().min(1, 'Select a check-out date'),
    guests: z.number().min(1, 'At least 1 guest'),
    message: z.string().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  })

export type BookingEnquiryValues = z.infer<typeof bookingEnquirySchema>
