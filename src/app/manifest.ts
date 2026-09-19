import { MetadataRoute } from 'next'
import { prisma } from '@/app/lib/prisma'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await prisma.settings.findFirst()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zahret-alrabie.com'

  return {
    name: settings?.companyName || 'زهرة الربيع',
    short_name: 'زهرة الربيع',
    description: settings?.description || 'زهرة الربيع - شركة رائدة في تقديم الخدمات والمنتجات المتميزة',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    scope: '/',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: settings?.icon || '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: settings?.icon || '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: settings?.icon || '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: settings?.icon || '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    categories: ['business', 'productivity', 'lifestyle'],
    related_applications: [],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'الخدمات',
        short_name: 'الخدمات',
        description: 'تصفح خدماتنا المتميزة',
        url: '/services',
        icons: [
          {
            src: settings?.icon || '/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'تواصل معنا',
        short_name: 'تواصل',
        description: 'تواصل معنا مباشرة',
        url: '/contact',
        icons: [
          {
            src: settings?.icon || '/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      }
    ]
  }
}
