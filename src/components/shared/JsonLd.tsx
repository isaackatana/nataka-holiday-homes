import { Helmet } from 'react-helmet-async'

/** Renders a <script type="application/ld+json"> tag via react-helmet-async.
 * Accepts a plain object (any valid schema.org shape) rather than a typed
 * schema — schema.org's vocabulary is large and evolving, and a hand-rolled
 * TS type here would either be incomplete or need constant upkeep for
 * marginal benefit over just getting the JSON shape right at each call site. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
