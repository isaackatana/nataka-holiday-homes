import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/shared/PagePlaceholder'

export default function PropertyEditor() {
  const { id } = useParams()
  return (
    <PagePlaceholder
      title={id ? 'Edit property' : 'New property'}
      note="Full property form + image uploader — built in Step 14/15."
    />
  )
}
