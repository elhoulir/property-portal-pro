import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Property, Stats } from '@/app/types/property'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function exportToCSV(properties: Property[], filename: string = 'properties.csv') {
  const headers = ['Address', 'Suburb', 'Price', 'Sqft', 'Bedrooms', 'Bathrooms', 'Type', 'Date']
  const rows = properties.map(p => [
    `"${p.address}"`,
    `"${p.suburb}"`,
    p.price,
    p.sqft,
    p.bedrooms || '',
    p.bathrooms || '',
    p.propertyType || '',
    p.date
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

export function calculateStats(properties: Property[]): Stats {
  if (properties.length === 0) {
    return {
      total: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      avgSqft: 0,
      bySuburb: {},
      byType: {}
    }
  }

  const prices = properties.map(p => p.price)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  const sqfts = properties.map(p => p.sqft)
  const avgSqft = Math.round(sqfts.reduce((a, b) => a + b, 0) / sqfts.length)
  
  const bySuburb = properties.reduce((acc: Record<string, number>, p) => {
    acc[p.suburb] = (acc[p.suburb] || 0) + 1
    return acc
  }, {})
  
  const byType = properties.reduce((acc: Record<string, number>, p) => {
    const type = p.propertyType || 'Unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return {
    total: properties.length,
    avgPrice: Math.round(avgPrice),
    minPrice,
    maxPrice,
    avgSqft,
    bySuburb,
    byType
  }
}
