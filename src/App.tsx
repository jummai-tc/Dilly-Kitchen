import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { OurStoryPage } from '@/pages/OurStoryPage'
import { MenuPage } from '@/pages/MenuPage'
import { CateringPage } from '@/pages/CateringPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { ContactPage } from '@/pages/ContactPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/*
 * The admin area is a separate chunk, so a public visitor never downloads the
 * dashboard, the auth provider or the Supabase auth code at all. It also sits
 * outside <Layout> — no site header, footer or navigation links to it, and it
 * is excluded from robots.txt and the sitemap.
 */
const AdminRoute = lazy(() =>
  import('@/components/admin/AdminRoute').then((m) => ({ default: m.AdminRoute })),
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/catering" element={<CateringPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminRoute />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
