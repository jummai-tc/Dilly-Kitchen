import { Seo } from '@/components/seo/Seo'
import { StreamHero } from '@/components/home/StreamHero'
import { IntroSection } from '@/components/home/IntroSection'
import { FeaturedDishes } from '@/components/home/FeaturedDishes'
import { CateringPreview } from '@/components/home/CateringPreview'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { VisitSection } from '@/components/home/VisitSection'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'

export function HomePage() {
  return (
    <>
      <Seo
        title="Nigerian Restaurant & Catering in Feltham, London"
        description="Dilly Kitchen serves fresh Nigerian and Pan-African food in Feltham, London — smoky jollof rice, traditional soups, suya and full catering for weddings, birthdays and corporate events."
      />
      <StreamHero />
      <IntroSection />
      <FeaturedDishes />
      <CateringPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <VisitSection />
      <WhatsAppCta />
    </>
  )
}
