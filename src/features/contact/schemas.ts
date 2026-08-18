import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Tell us a bit more (at least 10 characters)'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
