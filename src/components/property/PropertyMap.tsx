export function PropertyMap({
  latitude,
  longitude,
  title,
}: {
  latitude: number | null
  longitude: number | null
  title: string
}) {
  if (latitude === null || longitude === null) return null

  return (
    <div className="overflow-hidden rounded-card border border-sand-200">
      <iframe
        title={`Map showing the location of ${title}`}
        width="100%"
        height="320"
        loading="lazy"
        style={{ border: 0 }}
        src={`https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
      />
    </div>
  )
}
