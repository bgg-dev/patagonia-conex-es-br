import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Mountain, Plane, CalendarDays, MapPin, Info, Leaf, ChevronDown, ChevronUp, BedDouble, Users, Check, Pencil, Compass } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripDateField } from '@/components/trip-date-field';
import { bookingUrl, destinations } from '@/lib/destinations';
import { flightGuidance, origins, tripSchema, type Trip } from '@/lib/trip';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Planeje sua viagem à Patagônia — Patagonia_br' },
    { name: 'description', content: 'Escolha origem, destino, datas e hóspedes. Conheça seu destino na Patagônia Argentina, veja orientações de voo e busque hospedagem na Booking.com.' },
    { property: 'og:title', content: 'Sua viagem à Patagônia começa aqui — Patagonia_br' },
    { property: 'og:description', content: 'De São Paulo ou do Rio à Patagônia: planeje o roteiro, entenda as conexões e encontre sua hospedagem.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

type Draft = Omit<Trip, 'adults' | 'children' | 'rooms'> & { adults: string; children: string; rooms: string };
const initialDraft: Draft = { origin: 'GRU', destination: 'BRC', departure: '', returnDate: '', adults: '2', children: '0', rooms: '1' };
const dateLabel = (value: string) => format(parseISO(value), 'dd MMM yyyy', { locale: ptBR });

function Index() {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setErrors({});
    setTrip(null);
    setExpanded(false);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const numberValue = (value: string) => value.trim() === '' ? NaN : Number(value);
    const result = tripSchema.safeParse({ ...draft, adults: numberValue(draft.adults), children: numberValue(draft.children), rooms: numberValue(draft.rooms) });
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setTrip(null);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setErrors({});
    setTrip(result.data);
    setExpanded(false);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }));
  };
  const destination = destinations.find(d => d.code === draft.destination);
  const guidance = flightGuidance(draft.origin, draft.destination);
  const nights = trip ? differenceInCalendarDays(parseISO(trip.returnDate), parseISO(trip.departure)) : 0;
  const edit = () => { formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); formRef.current?.querySelector<HTMLElement>('[role="combobox"]')?.focus({ preventScroll: true }); };

  return <>
    <header className="border-b border-border bg-card">
      <div className="page-width flex h-18 items-center justify-between gap-4">
        <a href="#inicio" className="brand flex items-center gap-2.5" aria-label="Patagonia_br, início"><Mountain className="size-8 text-primary" strokeWidth={1.8} /><span>Patagonia<span className="text-primary">_br</span></span></a>
        <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><MapPin className="size-3.5 text-primary" /> Do Brasil à Patagônia Argentina</span>
      </div>
    </header>
    <main id="inicio" className="page-width pb-12">
      <div className="planner-scene" style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 28, 39, .48), rgba(7, 28, 39, .72)), url(${destination?.image})` }}>
      <section className="enter planner-intro text-center">
        <p className="eyebrow mb-3 text-primary">SEU ROTEIRO, DO SEU JEITO</p>
        <h1 className="planner-title">Sua viagem à <span className="text-primary">Patagônia</span> começa aqui</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Escolha de onde sair, para onde ir e quando viajar.<br className="hidden sm:block" /> Veja como chegar e encontre sua hospedagem.</p>
      </section>
      <ol className="journey-steps mx-auto mb-6 flex max-w-xl items-center justify-between" aria-label="Etapas da viagem">
        {['Sua viagem', 'Destino', 'Voos', 'Hotéis'].map((step, index) => <li key={step} className="flex items-center gap-2 text-xs"><span className={`step-number ${index === 0 || trip ? 'step-active' : ''}`}>{index === 0 && trip ? <Check className="size-3.5" /> : index + 1}</span><span className={index === 0 || trip ? 'font-medium text-foreground' : 'text-muted-foreground'}>{step}</span></li>)}
      </ol>
      <form ref={formRef} noValidate onSubmit={submit} className="travel-card planner-form p-4 md:p-5" aria-label="Planejar viagem">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Compass className="size-4 text-primary" /> Planeje sua viagem</div>
        <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0"><label className="planner-label" htmlFor="origin">Origem</label><Select value={draft.origin} onValueChange={value => { if (value === 'GRU' || value === 'GIG') update('origin', value); }}><SelectTrigger id="origin" className="planner-control"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(origins).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}</SelectContent></Select></div>
          <div className="min-w-0"><label className="planner-label" htmlFor="destination">Destino</label><Select value={draft.destination} onValueChange={value => { if (value === 'BRC' || value === 'USH' || value === 'FTE' || value === 'PMY') update('destination', value); }}><SelectTrigger id="destination" className="planner-control"><SelectValue /></SelectTrigger><SelectContent>{destinations.map(d => <SelectItem key={d.code} value={d.code}>{d.name} ({d.code})</SelectItem>)}</SelectContent></Select></div>
          <TripDateField id="departure" label="Ida" value={draft.departure} onChange={value => update('departure', value)} error={errors['departure']} />
          <TripDateField id="returnDate" label="Volta" value={draft.returnDate} onChange={value => update('returnDate', value)} error={errors['returnDate']} />
        </div>
        <div className="mt-3 grid gap-x-3 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {([{ key: 'adults', label: 'Adultos', min: 1 }, { key: 'children', label: 'Crianças', min: 0 }, { key: 'rooms', label: 'Quartos', min: 1 }] as const).map(field => <div key={field.key}><label htmlFor={field.key} className="planner-label">{field.label}</label><Input id={field.key} type="number" min={field.min} step={1} value={draft[field.key]} onChange={e => update(field.key, e.target.value)} className="planner-control" aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} />{errors[field.key] && <p id={`${field.key}-error`} className="mt-1.5 text-xs text-destructive">{errors[field.key]}</p>}</div>)}
          <div className="flex items-end sm:col-span-3 lg:col-span-1"><Button variant="travel" type="submit" className="h-12 w-full px-5">Planejar minha viagem <ArrowRight /></Button></div>
        </div>
        {Object.keys(errors).length > 0 && <p role="alert" className="mt-4 text-sm text-destructive">Confira os campos indicados para continuar.</p>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Seu roteiro começa aqui, sem compromisso.</span><span className="flex items-center gap-1.5"><Info className="size-3.5" /> Preços e disponibilidade são consultados nos sites de reserva.</span></div>
      </form>

      </div>
      {destination && <div ref={resultRef} className="result-flow mx-auto mt-5 max-w-4xl space-y-4" aria-live="polite">
        {trip && <div className="flex flex-wrap items-center justify-between gap-3 px-1"><div><p className="eyebrow text-primary">SEU PLANO DE VIAGEM</p><p className="mt-1.5 text-sm text-muted-foreground">{dateLabel(trip.departure)} — {dateLabel(trip.returnDate)} · {trip.adults} {trip.adults === 1 ? 'adulto' : 'adultos'}{trip.children > 0 ? ` · ${trip.children} ${trip.children === 1 ? 'criança' : 'crianças'}` : ''} · {trip.rooms} {trip.rooms === 1 ? 'quarto' : 'quartos'}</p></div><Button variant="ghost" size="sm" onClick={edit} className="text-primary"><Pencil /> Alterar viagem</Button></div>}
        <article className="travel-card overflow-hidden p-4 md:p-5" aria-labelledby="destination-title">
          <div className="grid gap-5 sm:grid-cols-[220px_1fr] md:grid-cols-[260px_1fr]">
            <img src={destination.image} alt={`Paisagem de ${destination.name}, Patagônia Argentina`} width={1024} height={768} className="summary-image" />
            <div className="flex flex-col justify-center px-2 py-2"><p className="eyebrow mb-2 text-primary">02 · SEU DESTINO</p><h2 id="destination-title" className="flex flex-wrap items-center gap-3 text-2xl font-bold">{destination.name}<span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{destination.code}</span></h2><p className="mb-4 mt-2 text-sm leading-6 text-muted-foreground">{destination.description}</p><div className="flex flex-wrap gap-x-5 gap-y-2 text-xs"><span className="flex items-center gap-1.5"><Leaf className="size-3.5 text-primary" /> Época recomendada: {destination.season}</span><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-primary" /> {destination.nights} sugeridas</span></div><Button variant="link" className="mt-3 h-7 self-start p-0 text-xs" aria-expanded={expanded} aria-controls="destination-details" onClick={() => setExpanded(!expanded)}>{expanded ? 'Ver menos' : 'Ver mais'}{expanded ? <ChevronUp /> : <ChevronDown />}</Button></div>
          </div>
          {expanded && <div id="destination-details" className="mt-4 border-t border-border px-2 pb-2 pt-4 text-sm leading-6 text-muted-foreground"><p>{destination.code === 'BRC' ? 'O Circuito Chico e o lago Nahuel Huapi são clássicos para conhecer a região. Reserve tempo para os passeios e para explorar o centro.' : destination.code === 'USH' ? 'O Parque Nacional Tierra del Fuego e o Canal Beagle revelam paisagens distintas. Distribua os passeios entre os dias do roteiro.' : destination.code === 'FTE' ? 'El Calafate é uma base para conhecer o Parque Nacional Los Glaciares. Se quiser incluir El Chaltén, planeje dias e deslocamentos adicionais.' : 'Puerto Madryn é uma base para visitar a Península Valdés. Passeios de observação de animais dependem da temporada e das condições de operação.'}</p><p className="mt-2 text-xs">Perfil de orçamento: {destination.budget.toLowerCase()}. A época e a duração sugeridas são referências editoriais, não uma previsão do tempo para sua viagem.</p></div>}
        </article>
        <article className="travel-card p-6 md:p-7" aria-labelledby="flight-title">
          <div className="flex items-center gap-5"><div className="transport-icon"><Plane /></div><div className="min-w-0"><p className="eyebrow mb-2 text-primary">03 · COMO CHEGAR</p><h2 id="flight-title" className="text-xl font-bold">{origins[draft.origin]} <ArrowRight className="mx-1 inline size-4 text-primary" /> {destination.name} ({destination.code})</h2><p className="mt-1 text-xs text-muted-foreground">Orientações de rota · Consulte disponibilidade com a companhia</p></div></div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            {guidance.seasonalDirect && <p><span className="font-semibold text-foreground">Diretos sazonais para Bariloche.</span> Em temporadas de inverno, GRU–BRC pode ter operações da Aerolíneas Argentinas, LATAM e GOL. Isso não confirma voos no período escolhido.</p>}
            <p><span className="font-semibold text-foreground">Via Buenos Aires.</span> {guidance.connection}</p>
            <p className="flex items-start gap-2 rounded-2xl bg-muted p-3 text-xs leading-5"><Info className="mt-0.5 size-4 shrink-0 text-primary" /><span>Aeroparque (AEP) e Ezeiza (EZE) são aeroportos diferentes. Sua conexão pode exigir traslado terrestre, retirada e novo despacho de bagagem. Confira os aeroportos e reserve tempo extra entre os voos.</span></p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><p className="max-w-md text-xs leading-5 text-muted-foreground">Consulte as companhias para confirmar horários, tarifas e disponibilidade nas suas datas.</p><Button asChild variant="outline" className="h-10 rounded-full text-xs"><a href="https://www.aerolineas.com.ar/pt-br" target="_blank" rel="noopener noreferrer">Consultar Aerolíneas Argentinas <ArrowUpRight /></a></Button></div>
        </article>
        {trip ? <article className="travel-card p-6 md:p-7" aria-labelledby="hotel-title">
          <div className="flex items-start gap-3"><div className="rounded-xl bg-secondary p-3 text-primary"><BedDouble className="size-6" /></div><div><p className="eyebrow mb-2 text-primary">04 · SUA HOSPEDAGEM</p><h2 id="hotel-title" className="text-xl font-bold">Encontre sua estadia em {destination.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Compare opções para suas datas na Booking.com.</p></div></div>
          <div className="my-5 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{dateLabel(trip.departure)} — {dateLabel(trip.returnDate)}</span><span className="flex items-center gap-2"><Users className="size-4 text-primary" />{trip.adults} {trip.adults === 1 ? 'adulto' : 'adultos'} · {trip.children} {trip.children === 1 ? 'criança' : 'crianças'}</span><span className="flex items-center gap-2"><BedDouble className="size-4 text-primary" />{trip.rooms} {trip.rooms === 1 ? 'quarto' : 'quartos'} · {nights} {nights === 1 ? 'noite' : 'noites'}</span></div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="max-w-md text-xs leading-5 text-muted-foreground"><p>Preços, opções e disponibilidade serão exibidos na Booking.com. Confira os dados antes de reservar.</p>{trip.children > 0 && <p className="mt-1">Informe a idade de cada criança na Booking.com para obter opções e valores adequados.</p>}</div>{nights > 0 ? <Button asChild variant="booking" className="h-12 shrink-0 px-6"><a href={bookingUrl(destination.query, import.meta.env['VITE_BOOKING_AFFILIATE_ID'], trip)} target="_blank" rel="sponsored noopener noreferrer">Buscar na Booking.com <ArrowUpRight /></a></Button> : <div className="max-w-xs text-xs text-destructive">Para buscar uma estadia com pernoite, escolha uma volta após a ida.</div>}</div>
          <p className="mt-4 text-[10px] text-muted-foreground">A reserva é concluída no site da Booking.com, em uma nova aba.</p>
        </article> : <article className="travel-card p-5" aria-labelledby="hotel-pending-title"><div className="flex items-center gap-3"><BedDouble className="size-5 text-primary" /><div><h2 id="hotel-pending-title" className="font-semibold">Hospedagem em {destination.name}</h2><p className="mt-1 text-sm text-muted-foreground">Complete as datas e clique em “Planejar minha viagem” para buscar hotéis para seu roteiro.</p></div></div></article>}
      </div>}
    </main>
    <footer className="border-t border-border"><div className="page-width flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left"><span className="text-xs text-muted-foreground">© 2026 Patagonia_br · Feito para brasileiros.</span><p className="max-w-xl text-[10px] leading-5 text-muted-foreground">Imagens ilustrativas geradas por IA. Links de afiliados habilitados podem gerar comissão, sem custo adicional para você.</p></div></footer>
  </>;
}
