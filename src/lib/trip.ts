import { z } from 'zod';
import { format, isValid, parse } from 'date-fns';

const dateField = z.string().refine(value => {
  const parsed = parse(value, 'yyyy-MM-dd', new Date(2000, 0, 1));
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value;
}, 'Escolha uma data válida.');
const quantity = (minimum: number, message: string) => z.number({ message }).int(message).min(minimum, message).max(Number.MAX_SAFE_INTEGER, message);

export const tripSchema = z.object({
  origin: z.enum(['GRU', 'GIG']),
  destination: z.enum(['BRC', 'USH', 'FTE', 'PMY']),
  departure: dateField,
  returnDate: dateField,
  adults: quantity(1, 'Informe pelo menos 1 adulto, em número inteiro.'),
  children: quantity(0, 'Informe 0 ou mais crianças, em número inteiro.'),
  rooms: quantity(1, 'Informe pelo menos 1 quarto, em número inteiro.'),
}).superRefine((trip, ctx) => {
  if (trip.returnDate < trip.departure) ctx.addIssue({ code: 'custom', path: ['returnDate'], message: 'A volta não pode ser anterior à ida.' });
});
export type Trip = z.infer<typeof tripSchema>;
export const origins = { GRU: 'São Paulo (GRU)', GIG: 'Rio de Janeiro (GIG)' };

export function flightGuidance(origin: Trip['origin'], destination: Trip['destination']) {
  return {
    seasonalDirect: origin === 'GRU' && destination === 'BRC',
    connection: 'Uma opção geral é voar até Buenos Aires e seguir em um voo doméstico da Aerolíneas Argentinas. Para o trecho internacional, consulte Aerolíneas Argentinas, LATAM e GOL.',
  };
}