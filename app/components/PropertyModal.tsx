'use client';

import { useState } from 'react';
import { Property } from '@/app/types/property';
import { formatPrice, formatDate } from '@/app/lib/utils';
import { X, MapPin, Home, Calendar, Bed, Bath, Maximize2, Heart, Share2, Car, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useFavorites } from '@/app/context/FavoritesContext';
import { ContactForm } from './ContactForm';
import { Button } from './ui/button';
import { useEffect } from 'react';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (property) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [property, onClose]);

  if (!property) return null;

  const favorite = isFavorite(property.id);
  const images = property.images || (property.imageUrl ? [property.imageUrl] : []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.address,
        text: `Check out this property: ${property.address}, ${property.suburb} - ${formatPrice(property.price)}`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
        <div className="bg-background rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{property.address}</h2>
              <p className="text-sm text-muted-foreground">{property.suburb}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-accent transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Image Gallery */}
            <div className="relative h-96 bg-muted">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        →
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-2xl font-bold shadow-lg">
                {formatPrice(property.price)}
              </div>
              {property.status && property.status !== 'Available' && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                  {property.status}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-accent/50 rounded-lg">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-2xl font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-2xl font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-2xl font-semibold">{property.sqft.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
                {property.parking && (
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-2xl font-semibold">{property.parking}</div>
                      <div className="text-sm text-muted-foreground">Parking</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.yearBuilt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-semibold">{property.yearBuilt}</p>
                  </div>
                )}
                {property.lotSize && (
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-semibold">{property.lotSize.toLocaleString()} sqft</p>
                  </div>
                )}
                {property.heating && (
                  <div>
                    <p className="text-sm text-muted-foreground">Heating</p>
                    <p className="font-semibold">{property.heating}</p>
                  </div>
                )}
                {property.cooling && (
                  <div>
                    <p className="text-sm text-muted-foreground">Cooling</p>
                    <p className="font-semibold">{property.cooling}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Price per Sq Ft</p>
                  <p className="font-semibold">{formatPrice(Math.round(property.price / property.sqft))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Listed</p>
                  <p className="font-semibold">{formatDate(property.date)}</p>
                </div>
              </div>

              {/* Agent Info */}
              {property.agent && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Contact Agent</h3>
                  <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      {property.agent.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{property.agent.name}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a href={`tel:${property.agent.phone}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {property.agent.phone}
                        </a>
                        <a href={`mailto:${property.agent.email}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {property.agent.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Button */}
              <Button onClick={() => setShowContactForm(true)} className="w-full" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Inquire About This Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      {showContactForm && (
        <ContactForm property={property} onClose={() => setShowContactForm(false)} />
      )}
    </>
  );
}