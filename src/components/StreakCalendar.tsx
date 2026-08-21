import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const DAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function StreakCalendar() {
  const { state } = useUser();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const activeDates = new Set(state.activeDates ?? []);
  const todayISO = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

  // First day of the month (0=Mon...6=Sun in ISO week)
  const firstDay = new Date(viewYear, viewMonth, 1);
  // Shift so Monday=0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    const now = new Date();
    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth())) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const canGoNext = !isCurrentMonth;

  // Build grid cells (leading blanks + days)
  const cells: { day: number | null; iso: string | null }[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, iso: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: isoDate(viewYear, viewMonth, d) });

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'white', border: '1px solid var(--border)' }}
      aria-label="Calendrier de streak"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={14} style={{ color: '#F59E0B' }} aria-hidden="true" />
          <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
            Streak · {state.streak} jour{state.streak !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg transition-all hover:opacity-60"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Mois précédent"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-medium px-1" style={{ color: 'var(--foreground)', minWidth: '80px', textAlign: 'center' }}>
            {MONTHS_FR[viewMonth].slice(0, 3)} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="p-1 rounded-lg transition-all hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Mois suivant"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0.5" role="row">
        {DAYS_FR.map((d, i) => (
          <div
            key={i}
            className="text-center text-xs font-semibold py-1"
            style={{ color: 'var(--muted-foreground)' }}
            aria-hidden="true"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label={`${MONTHS_FR[viewMonth]} ${viewYear}`}>
        {cells.map((cell, i) => {
          if (!cell.day || !cell.iso) {
            return <div key={i} aria-hidden="true" />;
          }

          const isToday = cell.iso === todayISO;
          const isActive = activeDates.has(cell.iso);
          const isFuture = cell.iso > todayISO;

          let bg = 'transparent';
          let color = 'var(--muted-foreground)';
          let borderStyle = 'none';
          let title = '';

          if (isActive) {
            bg = 'var(--primary)';
            color = 'white';
            title = `${cell.day} ${MONTHS_FR[viewMonth]} — jour d'apprentissage`;
          } else if (isToday) {
            bg = 'transparent';
            color = 'var(--primary)';
            borderStyle = '2px solid var(--primary)';
            title = "Aujourd'hui";
          } else if (isFuture) {
            color = 'var(--border)';
          } else {
            color = 'var(--muted-foreground)';
            title = `${cell.day} ${MONTHS_FR[viewMonth]} — non actif`;
          }

          return (
            <div
              key={i}
              role="gridcell"
              className="flex items-center justify-center rounded-lg text-xs font-medium transition-all"
              style={{
                height: '28px',
                background: bg,
                color,
                border: borderStyle,
                opacity: isFuture ? 0.3 : 1,
                fontWeight: isToday || isActive ? 600 : 400,
              }}
              aria-label={title || undefined}
              aria-current={isToday ? 'date' : undefined}
            >
              {isActive && !isToday ? (
                <span className="text-xs">{cell.day}</span>
              ) : (
                cell.day
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ background: 'var(--primary)' }} aria-hidden="true" />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Actif</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: 'var(--primary)' }} aria-hidden="true" />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
