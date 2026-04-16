export default function imageLoader({ src }: { src: string }): string {
  const base = process.env.NODE_ENV === 'production' ? '/portfolio-next1' : ''
  return `${base}${src}`
}
