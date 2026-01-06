'use client';

import { useState } from 'react';
import { Property } from '@/app/types/property';
import { formatPrice } from '@/app/lib/utils';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ContactFormProps {
    property: Property;
    onClose: () => void;
}

export function ContactForm({ property, onClose }: ContactFormProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: `I'm interested in ${property.address}, ${property.suburb} listed at ${formatPrice(property.price)}. Please contact me with more information.`
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Prepare complete contact data with property details
        const contactData = {
            ...formData,
            propertyId: property.id,
            propertyAddress: property.address,
            propertySuburb: property.suburb,
            propertyPrice: property.price,
            propertyType: property.propertyType,
            propertyDetails: {
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                sqft: property.sqft,
                yearBuilt: property.yearBuilt,
            },
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
        };

        // Here you would send to your backend/email service
        // For now, we'll simulate and log to console
        console.log('Contact Form Submission:', contactData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In production, you'd do something like:
        /*
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
          });
          
          if (!response.ok) throw new Error('Failed to send');
          
          setSubmitted(true);
        } catch (error) {
          alert('Failed to send message. Please try again.');
        }
        */

        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                <div className="bg-background rounded-lg shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                        We&apos;ll get back to you shortly about<br />
                        <span className="font-semibold">{property.address}</span>
                    </p>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-background rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background">
                    <h3 className="text-xl font-bold">Inquire About This Property</h3>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Property Summary */}
                <div className="p-4 bg-accent/50 border-b">
                    <p className="font-semibold">{property.address}</p>
                    <p className="text-sm text-muted-foreground">{property.suburb}</p>
                    <p className="text-lg font-bold text-primary mt-1">{formatPrice(property.price)}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone *</label>
                        <Input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="04XX XXX XXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Tell us about your interest..."
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Inquiry
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        By submitting, you agree to be contacted about this property
                    </p>
                </form>
            </div>
        </div>
    );
}