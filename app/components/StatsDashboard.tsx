'use client';

import { Property } from '@/app/types/property';
import { calculateStats, formatPrice } from '@/app/lib/utils';
import { Home, TrendingUp, MapPin, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface StatsDashboardProps {
  properties: Property[];
}

export function StatsDashboard({ properties }: StatsDashboardProps) {
  const stats = calculateStats(properties);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Home className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Price</p>
              <p className="text-3xl font-bold">{formatPrice(stats.avgPrice)}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price Range</p>
              <p className="text-lg font-bold">{formatPrice(stats.minPrice)}</p>
              <p className="text-xs text-muted-foreground">to {formatPrice(stats.maxPrice)}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Suburbs</p>
              <p className="text-3xl font-bold">{Object.keys(stats.bySuburb).length}</p>
              <p className="text-xs text-muted-foreground">locations</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-full">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
