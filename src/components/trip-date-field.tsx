import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ptBR as calendarLocale } from 'react-day-picker/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function TripDateField({ id, label, value, onChange, error }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string | undefined }) {
  const [open, setOpen] = useState(false);
  const parsed = parse(value, 'yyyy-MM-dd', new Date(2000, 0, 1));
  const selected = isValid(parsed) ? parsed : undefined;
  return <div className="min-w-0">
    <label className="planner-label" htmlFor={id}>{label}</label>
    <div className="relative">
      <Input id={id} type="text" inputMode="numeric" maxLength={10} placeholder="dd/mm/aaaa" value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value} onChange={e => { const text = e.target.value; onChange(/^\d{2}\/\d{2}\/\d{4}$/.test(text) ? text.split('/').reverse().join('-') : text); }} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="planner-control date-input" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild><Button variant="ghost" size="icon" type="button" className="absolute right-1 top-1.5 text-primary" aria-label={`Abrir calendário de ${label.toLowerCase()}`}><CalendarDays /></Button></PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end"><Calendar className="pointer-events-auto" mode="single" locale={calendarLocale} selected={selected} {...(selected ? { defaultMonth: selected } : {})} onSelect={date => { if (date) { onChange(format(date, 'yyyy-MM-dd', { locale: ptBR })); setOpen(false); } }} /></PopoverContent>
      </Popover>
    </div>
    {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">{error}</p>}
  </div>;
}