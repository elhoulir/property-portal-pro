'use client';

import { useState, useMemo, useEffect } from 'react';
import { PropertyList } from './components/PropertyList';
import { SearchFilters } from './components/SearchFilters';
import { StatsDashboard } from './components/StatsDashboard';
import { PropertyModal } from './components/PropertyModal';
import { Building2, Heart, Moon, Sun, Download, List } from 'lucide-react';
import { Property, SortOption } from './types/property';
import { useFavorites } from './context/FavoritesContext';
import { useTheme } from './context/ThemeContext';
import { useRecentlyViewed } from './context/RecentlyViewedContext';
import { exportToCSV } from './lib/utils';
import { Button } from './components/ui/button';

type ViewMode = 'all' | 'favorites';

// Hardcoded sample data as fallback
const sampleProperties: Property[] = [
  {
    id: 1,
    address: "123 Collins Street",
    suburb: "Melbourne CBD",
    price: 850000,
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    date: "2024-11-15",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
  },
  {
    id: 2,
    address: "45 Brunswick Street",
    suburb: "Fitzroy",
    price: 1200000,
    sqft: 1800,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Townhouse",
    date: "2024-11-20",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
  },
  {
    id: 3,
    address: "78 Chapel Street",
    suburb: "South Yarra",
    price: 950000,
    sqft: 1400,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    date: "2024-12-01",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
  },
  {
    id: 4,
    address: "156 Lygon Street",
    suburb: "Carlton",
    price: 780000,
    sqft: 1100,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    date: "2024-11-28",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
  },
  {
    id: 5,
    address: "89 Acland Street",
    suburb: "St Kilda",
    price: 1350000,
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "House",
    date: "2024-12-05",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
  },
  {
    id: 6,
    address: "234 Toorak Road",
    suburb: "Toorak",
    price: 2100000,
    sqft: 2800,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    date: "2024-12-08",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    id: 7,
    address: "67 Smith Street",
    suburb: "Collingwood",
    price: 720000,
    sqft: 950,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Apartment",
    date: "2024-11-18",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
  },
  {
    id: 8,
    address: "12 Victoria Street",
    suburb: "Richmond",
    price: 890000,
    sqft: 1300,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    date: "2024-12-03",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
  },
  {
    id: 9,
    address: "345 High Street",
    suburb: "Prahran",
    price: 1050000,
    sqft: 1600,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Townhouse",
    date: "2024-11-25",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
  },
  {
    id: 10,
    address: "98 Sydney Road",
    suburb: "Brunswick",
    price: 680000,
    sqft: 900,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    date: "2024-12-10",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
  },
  {
    id: 11,
    address: "210 Beach Road",
    suburb: "Brighton",
    price: 1850000,
    sqft: 2400,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    date: "2024-12-12",
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    id: 12,
    address: "55 Johnston Street",
    suburb: "Fitzroy",
    price: 795000,
    sqft: 1050,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    date: "2024-11-22",
    imageUrl: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80"
  }
];

export default function Home() {
  // Use sample data directly
  const allProperties: Property[] = sampleProperties;

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');

  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Get favorite properties
  const favoriteProperties = useMemo(() => {
    return allProperties.filter(p => favorites.includes(p.id));
  }, [favorites, allProperties]);

  // Get display properties based on view mode
  const displayProperties = viewMode === 'favorites' ? favoriteProperties : filteredProperties;

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...displayProperties];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'date-newest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'size-asc':
        return sorted.sort((a, b) => a.sqft - b.sqft);
      case 'size-desc':
        return sorted.sort((a, b) => b.sqft - a.sqft);
      default:
        return sorted;
    }
  }, [displayProperties, sortBy]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    addToRecentlyViewed(property.id);
  };

  const handleExport = () => {
    exportToCSV(sortedProperties, `properties-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Property Portal Pro</h1>
                <p className="text-sm text-muted-foreground">Discover your next property</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <StatsDashboard properties={filteredProperties} />

        {/* View Mode Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'all'
                  ? 'bg-background shadow-sm'
                  : 'hover:bg-background/50'
                }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              All Properties <span suppressHydrationWarning>({filteredProperties.length})</span>
            </button>
            <button
              onClick={() => setViewMode('favorites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'favorites'
                  ? 'bg-background shadow-sm'
                  : 'hover:bg-background/50'
                }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Favorites <span suppressHydrationWarning>({favorites.length})</span>
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="ml-auto px-4 py-2 rounded-md border bg-background text-sm"
          >
            <option value="date-newest">Newest First</option>
            <option value="date-oldest">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="size-asc">Size: Small to Large</option>
            <option value="size-desc">Size: Large to Small</option>
          </select>
        </div>

        {/* Search Filters (only show in 'all' mode) */}
        {viewMode === 'all' && (
          <SearchFilters properties={allProperties} onFilter={setFilteredProperties} />
        )}

        {/* Property List */}
        <PropertyList
          properties={sortedProperties}
          onPropertyClick={handlePropertyClick}
        />
      </main>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Footer */}
      <footer className="bg-card border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Property Portal Pro. All rights reserved.</p>
            <p className="mt-2" suppressHydrationWarning>
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved to favorites
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}