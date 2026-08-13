import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/shared/PagePlaceholder'

export default function PropertyDetails() {
  const { slug } = useParams()
  return (
    <PagePlaceholder
      title={`Property: ${slug}`}
      note="Gallery, amenities, availability, enquiry form, map — built in Step 10."
    />
  )
}
