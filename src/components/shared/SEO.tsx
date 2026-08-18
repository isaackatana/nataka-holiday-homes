import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://natakaholidayhomes.com' // update once the real domain is live

interface SEOProps {
  title: string
  description: string
  image?: string
  /** Path only (e.g. "/stays/azure-reef-villa-diani"), not a full URL —
   * SEO builds the canonical/OG URL from this + SITE_URL, so callers
   * don't each need to know the site's domain. */
  path?: string
  type?: 'website' | 'article'
  /** Pages behind auth (favorites, my-bookings, profile, all of /admin)
   * should never be indexed — search results linking to a page that just
   * redirects to /login serve no one. */
  noindex?: boolean
}

/** Per-page title/description/OG tags. See the architecture doc §1 for
 * why this is client-side only for now (build-time prerendering for
 * property pages specifically — better WhatsApp/Facebook link previews —
 * remains a follow-up beyond this pass, noted there and in supabase/README.md
 * if you want to pick it up later). */
export function SEO({ title, description, image, path, type = 'website', noindex }: SEOProps) {
  const fullTitle = `${title} | Nataka Holiday Homes`
  const url = path ? `${SITE_URL}${path}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
