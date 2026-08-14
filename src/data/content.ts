export interface WhyChooseUsItem {
  title: string
  description: string
  icon: 'shield-check' | 'message-circle' | 'map-pin' | 'sparkles'
}

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    title: 'Verified properties',
    description: 'Every home is inspected and listed by our team — no third-party listings, no surprises on arrival.',
    icon: 'shield-check',
  },
  {
    title: 'Local, on the ground',
    description: 'Based in Diani, not a call centre abroad. We know these homes and this coast personally.',
    icon: 'map-pin',
  },
  {
    title: 'Real people, on WhatsApp',
    description: 'Message us directly about any property — a real person replies, not a chatbot.',
    icon: 'message-circle',
  },
  {
    title: 'Guest services included',
    description: 'Housekeeping, airport transfers, and local experiences arranged for you, not left to figure out alone.',
    icon: 'sparkles',
  },
]

export interface Testimonial {
  name: string
  quote: string
  stayedAt: string
}

/**
 * PLACEHOLDER — swap for real guest quotes once the business has stays
 * completed and reviews collected. Attributing fabricated quotes to named
 * guests before the business has any real guests would be dishonest, so
 * these lead with "Placeholder" in the source comment as a flag to
 * replace before launch, not to ship as-is.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Guest testimonial coming soon',
    quote:
      'This section will show real guest reviews once bookings are completed — pulled from the reviews table where status = approved.',
    stayedAt: '',
  },
]
