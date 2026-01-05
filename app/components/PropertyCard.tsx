'use client';

import { Property } from '@/app/types/property';
import { Card, CardContent } from '@/app/components/ui/card';
import { formatPrice, formatDate } from '@/app/lib/utils';
import { MapPin, Home, Calendar, Bed, Bath, Heart } from 'lucide-react';
import { useFavorites } from '@/app/context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Card className="overflow-hidden group cursor-pointer relative" onClick={onClick}>
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-md"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={`w-5 h-5 transition-all ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </button>

      <div className="relative h-48 overflow-hidden bg-muted">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.address}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {formatPrice(property.price)}
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1 line-clamp-1">
              {property.address}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.suburb}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} bed</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} bath</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>{formatDate(property.date)}</span>
            </div>
            {property.propertyType && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {property.propertyType}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
