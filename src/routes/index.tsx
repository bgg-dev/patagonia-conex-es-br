import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, ArrowUpRight, Mountain, Plane, MapPin, CalendarDays, Check, Leaf, Globe2, Bus, Info, Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { bookingUrl, destinations } from '@/lib/destinations';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Patagonia_br — De São Paulo e Rio à Patagônia Argentina' },
    { name: 'description', content: 'Planeje sua viagem à Patagônia Argentina saindo de GRU ou GIG. Compare conexões, descubra quatro destinos e encontre sua hospedagem.' },
    { property: 'og:title', content: 'Patagonia_br — Sua viagem à Patagônia começa aqui' },
    { property: 'og:description', content: 'De São Paulo e Rio de Janeiro a Bariloche, Ushuaia, El Calafate e Puerto Madryn: conexões e estadias para seu roteiro.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [origin, setOrigin] = useState<'GRU' | 'GIG'>('GRU');
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="page-width flex h-20 items-center justify-between gap-4">
          <a href="#" className="brand flex items-center gap-2.5" aria-label="Patagonia_br, início"><Mountain className="size-8 text-primary" strokeWidth={1.8} />Patagonia<span className="-ml-2 text-primary">_br</span></a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            <Button variant="ghost" onClick={() => scrollTo('conexoes')} className="px-0 font-medium text-muted-foreground">Como chegar</Button>
            <Button variant="ghost" onClick={() => scrollTo('destinos')} className="px-0 font-medium text-muted-foreground">Destinos</Button>
            <Button variant="travel" className="h-10 px-5" onClick={() => scrollTo('destinos')}>Encontre sua estadia <ArrowUpRight /></Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav className="page-width flex flex-col gap-2 pb-4 md:hidden"><Button variant="ghost" onClick={() => scrollTo('conexoes')}>Como chegar</Button><Button variant="travel" onClick={() => scrollTo('destinos')}>Destinos e hospedagem <ArrowRight /></Button></nav>}
      </header>
      <main>
        <section className="page-width enter pb-14 pt-14 text-center md:pb-16 md:pt-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> DO BRASIL PARA O EXTRAORDINÁRIO</div>
          <h1 className="hero-title mx-auto max-w-4xl">Descubra a <span className="text-primary">Patagônia Argentina:</span><br className="hidden md:block" /> Conexões de São Paulo<br className="hidden md:block" /> e Rio de Janeiro</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">Grandes paisagens, um roteiro do seu jeito. Encontre a melhor conexão,<br className="hidden md:block" /> escolha seu destino e planeje a viagem que cabe no seu orçamento.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Button variant="travel" className="h-12 px-7" onClick={() => scrollTo('destinos')}>Explore os destinos <ArrowRight /></Button><Button variant="outline" className="h-12 rounded-full bg-card px-6" onClick={() => scrollTo('conexoes')}><Plane /> Veja como chegar</Button></div>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Saídas de GRU e GIG</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> 4 destinos inesquecíveis</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Opções para cada orçamento</span></div>
        </section>
        <section id="conexoes" className="page-width pb-16">
          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="eyebrow mb-2.5 text-primary">A VIAGEM COMEÇA AQUI</p><h2 className="section-title">Do Brasil à Patagônia</h2><p className="mt-2 text-sm text-muted-foreground">Escolha seu ponto de partida. A gente conecta as possibilidades.</p></div>
            <div className="flex self-start rounded-full border border-border bg-card p-1" aria-label="Aeroporto de partida">
              <Button variant={origin === 'GRU' ? 'travel' : 'ghost'} className="h-10 rounded-full px-5" aria-pressed={origin === 'GRU'} onClick={() => setOrigin('GRU')}>São Paulo <span className="text-xs opacity-65">GRU</span></Button>
              <Button variant={origin === 'GIG' ? 'travel' : 'ghost'} className="h-10 rounded-full px-5" aria-pressed={origin === 'GIG'} onClick={() => setOrigin('GIG')}>Rio de Janeiro <span className="text-xs opacity-65">GIG</span></Button>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <article className="travel-card flex flex-col items-center p-7 text-center"><div className="transport-icon mb-5"><Plane /></div><span className="rounded-full bg-sunshine px-3 py-1 text-[10px] font-semibold text-sunshine-foreground">{origin === 'GRU' ? 'DIRETO · SAZONAL' : 'CONEXÃO · INVERNO'}</span><h3 className="mb-2 mt-3 text-xl font-bold">{origin === 'GRU' ? 'Direto para a neve' : 'Rumo à neve'}</h3><p className="text-sm leading-6 text-muted-foreground">{origin === 'GRU' ? 'No inverno, vá de São Paulo a Bariloche sem escalas, conforme a malha da temporada.' : 'Do Rio a Bariloche via Buenos Aires. Consulte a oferta da temporada antes de reservar.'}</p><div className="mt-5 flex w-full items-center text-sm font-bold"><span>{origin}</span><span className="route-line" /><Plane className="size-4 text-muted-foreground" /><span className="route-line" /><span>BRC</span></div><div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">{origin === 'GRU' ? 'Aerolíneas Argentinas · LATAM · GOL' : 'Trecho internacional + Aerolíneas Argentinas'}</div></article>
            <article className="travel-card flex flex-col items-center p-7 text-center"><div className="transport-icon mb-5"><Plane /></div><span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold text-primary">MAIS POSSIBILIDADES</span><h3 className="mb-2 mt-3 text-xl font-bold">Via Buenos Aires</h3><p className="text-sm leading-6 text-muted-foreground">Uma parada, quatro destinos. Combine seu voo ao país com uma conexão doméstica.</p><div className="mt-5 flex w-full items-center text-sm font-bold"><span>{origin}</span><span className="route-line" /><span className="text-xs text-muted-foreground">AEP / EZE</span><span className="route-line" /><span>Patagônia</span></div><div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">Internacional: Aerolíneas · LATAM · GOL<br /><span className="mt-1 inline-block">Doméstico: Aerolíneas Argentinas</span></div></article>
            <article className="travel-card flex flex-col items-center p-7 text-center"><div className="transport-icon mb-5"><Bus /></div><span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold text-muted-foreground">NO SEU RITMO</span><h3 className="mb-2 mt-3 text-xl font-bold">Pela estrada</h3><p className="text-sm leading-6 text-muted-foreground">Voe até Buenos Aires e siga de ônibus. Uma alternativa para quem tem tempo e quer explorar.</p><div className="mt-5 flex w-full items-center text-sm font-bold"><span>Buenos Aires</span><span className="route-line" /><Bus className="size-4 text-muted-foreground" /><span className="route-line" /><span>Sul</span></div><div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">Viagens longas · Compare tempo e custo<br /><span className="mt-1 inline-block">Ideal para roteiros com mais dias</span></div></article>
          </div>
          <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" /> Voos diretos são sazonais. Confira datas e disponibilidade. Conexões entre AEP e EZE podem exigir traslado e tempo extra.</p>
          <p className="mt-1 text-center text-[10px] text-muted-foreground">Referência: <a href="https://www.latamairlines.com/br/pt/imprensa/noticias/latam-brasil-amplia-oferta-internacional-de-2026-com-mais-voos-p" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">malha sazonal LATAM</a> · <a href="https://viagemeturismo.abril.com.br/mundo/sao-paulo-e-bariloche-serao-ligadas-por-voos-diretos-no-inverno-de-2026/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">conexões de inverno 2026</a></p>
        </section>
        <section id="destinos" className="page-width pb-14">
          <div className="mb-8 text-center"><p className="eyebrow mb-2.5 text-primary">ESCOLHA SUA PRÓXIMA MEMÓRIA</p><h2 className="section-title">Uma Patagônia. Muitos jeitos de viver.</h2><p className="mt-3 text-sm text-muted-foreground">Dos lagos ao fim do mundo, encontre o destino que combina com você.</p></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map(d => <article key={d.code} className="travel-card flex flex-col p-3.5 text-center"><div className="relative"><img src={d.image} alt={`Paisagem de ${d.name}, Patagônia Argentina`} width={1024} height={768} loading="lazy" className="destination-image" /><span className="absolute right-3 top-3 rounded-full bg-card/95 px-3 py-1.5 text-[11px] font-bold">{d.code}</span></div><div className="flex flex-1 flex-col px-2 pb-2 pt-5"><p className="eyebrow text-[9px] text-primary">{d.tag}</p><h3 className="mb-2 mt-2 text-xl font-bold">{d.name}</h3><p className="min-h-20 text-[13px] leading-6 text-muted-foreground">{d.description}</p><div className="mb-5 mt-4 space-y-2.5 border-t border-border pt-4 text-xs text-muted-foreground"><p className="flex items-center justify-center gap-2"><CalendarDays className="size-3.5" /><span>Estadia sugerida: <strong className="font-semibold text-foreground">{d.nights}</strong></span></p><p className="flex items-center justify-center gap-2"><Leaf className="size-3.5" />{d.season}</p><p className="flex items-center justify-center gap-2"><Compass className="size-3.5" />{d.budget}</p></div><Button asChild variant="booking" className="mt-auto h-11 w-full px-3 text-xs"><a href={bookingUrl(d.query, import.meta.env.VITE_BOOKING_AFFILIATE_ID)} target="_blank" rel="sponsored noopener noreferrer" aria-label={`Ver hospedagens em ${d.name} na Booking.com`}>Ver hospedagens <ArrowUpRight /></a></Button><p className="mt-2.5 text-[10px] text-muted-foreground">na Booking.com</p></div></article>)}
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">Estadias e perfis de orçamento são sugestões de planejamento, não cotações. Valores variam conforme a época e suas escolhas.</p>
        </section>
        <section className="border-y border-border bg-secondary/40 py-9"><div className="page-width flex flex-col items-center justify-between gap-6 md:flex-row"><div className="flex items-center gap-4"><Globe2 className="size-9 shrink-0 text-primary" strokeWidth={1.4} /><div><h2 className="text-lg font-bold">Sua aventura começa com um bom plano.</h2><p className="mt-1 text-sm text-muted-foreground">Defina as datas, compare as conexões e reserve sua estadia com antecedência.</p></div></div><Button variant="travel" className="h-11 shrink-0 px-6" onClick={() => scrollTo('destinos')}>Encontre seu destino <ArrowRight /></Button></div></section>
      </main>
      <footer className="page-width py-8"><div className="flex flex-col items-center justify-between gap-4 md:flex-row"><a href="#" className="flex items-center gap-2 font-display text-lg font-extrabold"><Mountain className="size-6 text-primary" />Patagonia<span className="-ml-2 text-primary">_br</span></a><p className="text-xs text-muted-foreground">Feito para brasileiros. Inspirado pela Patagônia.</p><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" /> Argentina, América do Sul</span></div><div className="mt-6 border-t border-border pt-5 text-center text-[10px] leading-5 text-muted-foreground">© 2026 Patagonia_br · Imagens ilustrativas geradas por IA. Ao reservar por links de afiliados habilitados, podemos receber uma comissão, sem custo adicional para você.</div></footer>
    </>
  );
}
