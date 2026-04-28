import { Nav } from '@/components/nav'
import { ProjectsSection } from '@/components/projects-section'
import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { LoadingScreen } from '@/components/loading-screen'

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Nav />
      <main className="flex-1">
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  )
}
