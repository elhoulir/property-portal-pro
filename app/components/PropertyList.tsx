'use client';

import { Property } from '@/app/types/property';
import { PropertyCard } from './PropertyCard';
import { Home } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

export function PropertyList({ properties, onPropertyClick }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
          <Home className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your filters or search criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{properties.length}</span>{' '}
          {properties.length === 1 ? 'property' : 'properties'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <PropertyCard 
              property={property}
              onClick={() => onPropertyClick?.(property)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
