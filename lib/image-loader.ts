export default function imageLoader({
  src,
}: {
  src: string
  width: number
  quality?: number
}): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  return `${base}${src}`
}
