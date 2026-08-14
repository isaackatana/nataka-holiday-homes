import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

/** Per-page title/description/OG tags. See the architecture doc §1 for
 * why this is client-side only for now (with build-time prerendering for
 * property pages flagged as a Step 17 follow-up for WhatsApp/social link
 * previews specifically). */
export function SEO({ title, description, image, url }: SEOProps) {
  const fullTitle = `${title} | Nataka Holiday Homes`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </Helmet>
  )
}
