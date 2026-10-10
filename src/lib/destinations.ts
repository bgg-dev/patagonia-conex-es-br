import bariloche from '@/assets/bariloche.jpg';
import ushuaia from '@/assets/ushuaia.jpg';
import calafate from '@/assets/calafate.jpg';
import madryn from '@/assets/madryn.jpg';
import { tripSchema, type Trip } from '@/lib/trip';

export const destinations = [
  { name: 'Bariloche', code: 'BRC', image: bariloche, tag: 'LAGOS & NEVE', description: 'Lagos cristalinos, montanhas e chocolate. Um clássico que encanta em qualquer estação.', nights: '5–7 noites', season: 'Jun–ago · Dez–mar', budget: 'Econômico a confortável', query: 'San Carlos de Bariloche, Argentina' },
  { name: 'Ushuaia', code: 'USH', image: ushuaia, tag: 'O FIM DO MUNDO', description: 'Navegue pelo Canal Beagle e descubra trilhas e paisagens no extremo sul do continente.', nights: '4–5 noites', season: 'Nov–mar', budget: 'Confortável a premium', query: 'Ushuaia, Argentina' },
  { name: 'El Calafate', code: 'FTE', image: calafate, tag: 'GELEIRAS & AVENTURA', description: 'Sinta a imensidão do Perito Moreno. Gelo azul e experiências que ficam para sempre.', nights: '3–4 noites', season: 'Out–abr', budget: 'Confortável a premium', query: 'El Calafate, Argentina' },
  { name: 'Puerto Madryn', code: 'PMY', image: madryn, tag: 'NATUREZA & VIDA MARINHA', description: 'Baleias, pinguins e o encontro com a natureza na costa da Península Valdés.', nights: '3–5 noites', season: 'Jun–dez · Baleias', budget: 'Econômico a confortável', query: 'Puerto Madryn, Argentina' },
];

export function bookingUrl(destination: string, affiliateId?: string, trip?: Trip) {
  const url = new URL('https://www.booking.com/searchresults.pt-br.html');
  url.searchParams.set('ss', destination);
  url.searchParams.set('lang', 'pt-br');
  url.searchParams.set('selected_currency', 'BRL');
  if (affiliateId?.trim()) url.searchParams.set('aid', affiliateId.trim());
  if (trip) {
    const validated = tripSchema.parse(trip);
    url.searchParams.set('checkin', validated.departure);
    url.searchParams.set('checkout', validated.returnDate);
    url.searchParams.set('group_adults', String(validated.adults));
    url.searchParams.set('group_children', String(validated.children));
    url.searchParams.set('no_rooms', String(validated.rooms));
  }
  return url.toString();
}