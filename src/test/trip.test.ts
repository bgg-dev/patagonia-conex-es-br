import { describe, expect, it } from 'vitest';
import { tripSchema, flightGuidance, type Trip } from '@/lib/trip';
import { bookingUrl } from '@/lib/destinations';

const trip: Trip = { origin: 'GRU', destination: 'BRC', departure: '2026-12-10', returnDate: '2026-12-17', adults: 2, children: 0, rooms: 1 };
describe('Trip planning rules', () => {
  it('rejects a return before departure', () => {
    expect(tripSchema.safeParse({ ...trip, returnDate: '2026-12-09' }).success).toBe(false);
  });
  it('accepts a return on or after departure', () => {
    expect(tripSchema.safeParse({ ...trip, returnDate: trip.departure }).success).toBe(true);
    expect(tripSchema.safeParse(trip).success).toBe(true);
  });
  it.each(['', '2026-02-30', 'not-a-date'])('rejects invalid departure %s', departure => {
    expect(tripSchema.safeParse({ ...trip, departure }).success).toBe(false);
  });
  it.each(['adults', 'rooms'] as const)('requires at least one %s', field => {
    expect(tripSchema.safeParse({ ...trip, [field]: 0 }).success).toBe(false);
  });
  it('allows zero children but not negative children', () => {
    expect(tripSchema.safeParse(trip).success).toBe(true);
    expect(tripSchema.safeParse({ ...trip, children: -1 }).success).toBe(false);
  });
  it.each(['adults', 'children', 'rooms'] as const)('requires integer %s', field => {
    expect(tripSchema.safeParse({ ...trip, [field]: 1.5 }).success).toBe(false);
    expect(tripSchema.safeParse({ ...trip, [field]: NaN }).success).toBe(false);
  });
  it('restricts origins to GRU and GIG', () => {
    expect(tripSchema.safeParse({ ...trip, origin: 'CGH' }).success).toBe(false);
    expect(tripSchema.safeParse({ ...trip, origin: 'GIG' }).success).toBe(true);
  });
  it('uses seasonal direct guidance only for GRU to BRC', () => {
    expect(flightGuidance('GRU', 'BRC').seasonalDirect).toBe(true);
    expect(flightGuidance('GIG', 'BRC').seasonalDirect).toBe(false);
    expect(flightGuidance('GRU', 'USH').seasonalDirect).toBe(false);
  });
  it('passes the selected dates and party to Booking without inventing child ages', () => {
    const url = new URL(bookingUrl('Ushuaia, Argentina', undefined, { ...trip, destination: 'USH', children: 2, rooms: 2 }));
    expect(url.searchParams.get('checkin')).toBe('2026-12-10');
    expect(url.searchParams.get('checkout')).toBe('2026-12-17');
    expect(url.searchParams.get('group_adults')).toBe('2');
    expect(url.searchParams.get('group_children')).toBe('2');
    expect(url.searchParams.get('no_rooms')).toBe('2');
    expect(url.searchParams.has('age')).toBe(false);
  });
  it('rejects invalid trips before generating outbound links', () => {
    expect(() => bookingUrl('Bariloche', undefined, { ...trip, adults: -1 })).toThrow();
  });
});