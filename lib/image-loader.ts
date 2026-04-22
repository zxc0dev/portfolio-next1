export default function imageLoader({ src }: { src: string }): string {
  const base = process.env.GITHUB_PAGES === 'true' ? '/portfolio-next1' : ''
  return `${base}${src}`
}
