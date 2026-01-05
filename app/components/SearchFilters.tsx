'use client';

import { useState, useEffect } from 'react';
import { Property, FilterState } from '@/app/types/property';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  properties: Property[];
  onFilter: (filtered: Property[]) => void;
}

export function SearchFilters({ properties, onFilter }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    minPrice: null,
    maxPrice: null,
    minSqft: null,
    maxSqft: null,
    suburb: '',
    dateFrom: '',
    dateTo: '',
  });

  // Get unique suburbs for dropdown
  const suburbs = Array.from(new Set(properties.map(p => p.suburb))).sort();

  useEffect(() => {
    filterProperties();
  }, [filters]);

  const filterProperties = () => {
    let filtered = [...properties];

    // Search term (address or suburb)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.address.toLowerCase().includes(term) ||
          p.suburb.toLowerCase().includes(term)
      );
    }

    // Suburb filter
    if (filters.suburb) {
      filtered = filtered.filter(p => p.suburb === filters.suburb);
    }

    // Price range
    if (filters.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    // Square footage range
    if (filters.minSqft !== null) {
      filtered = filtered.filter(p => p.sqft >= filters.minSqft!);
    }
    if (filters.maxSqft !== null) {
      filtered = filtered.filter(p => p.sqft <= filters.maxSqft!);
    }

    // Date range
    if (filters.dateFrom) {
      filtered = filtered.filter(p => p.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(p => p.date <= filters.dateTo);
    }

    onFilter(filtered);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      minPrice: null,
      maxPrice: null,
      minSqft: null,
      maxSqft: null,
      suburb: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters = 
    filters.searchTerm ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.minSqft !== null ||
    filters.maxSqft !== null ||
    filters.suburb ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="mb-8 space-y-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-md p-6 border">
        {/* Main Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by address or suburb..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-12 px-6"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-12 px-6"
            >
              <X className="w-5 h-5 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t animate-fade-in">
            {/* Suburb Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Suburb</label>
              <select
                value={filters.suburb}
                onChange={(e) => setFilters({ ...filters, suburb: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
              >
                <option value="">All Suburbs</option>
                {suburbs.map((suburb) => (
                  <option key={suburb} value={suburb}>
                    {suburb}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Price</label>
              <Input
                type="number"
                placeholder="e.g. 500000"
                value={filters.minPrice ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <Input
                type="number"
                placeholder="e.g. 1000000"
                value={filters.maxPrice ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>

            {/* Sqft Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Sqft</label>
              <Input
                type="number"
                placeholder="e.g. 800"
                value={filters.minSqft ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minSqft: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Sqft</label>
              <Input
                type="number"
                placeholder="e.g. 2000"
                value={filters.maxSqft ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxSqft: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Date From</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date To</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
