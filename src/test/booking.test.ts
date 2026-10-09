import { describe, expect, it } from 'vitest';
import { bookingUrl, destinations } from '@/lib/destinations';

describe('Booking destination links', () => {
  it.each(['BRC', 'USH', 'FTE', 'PMY'])('links %s to its own destination', code => {
    const destination = destinations.find(d => d.code === code);
    if (!destination) throw new Error('Missing destination');
    const url = new URL(bookingUrl(destination.query));
    expect(url.hostname).toBe('www.booking.com');
    expect(url.searchParams.get('ss')).toBe(destination.query);
    expect(url.searchParams.get('lang')).toBe('pt-br');
  });
  it('does not invent an affiliate identifier', () => {
    expect(new URL(bookingUrl('Bariloche')).searchParams.has('aid')).toBe(false);
  });
  it('includes the supplied affiliate identifier', () => {
    expect(new URL(bookingUrl('Bariloche', '123456')).searchParams.get('aid')).toBe('123456');
  });
});
