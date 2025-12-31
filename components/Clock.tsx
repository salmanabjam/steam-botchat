import React, { useEffect, useState } from 'react';
import { Clock as ClockIcon, Calendar as CalendarIcon } from 'lucide-react';
import moment from 'jalali-moment';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = moment(date).locale('fa').format('HH:mm:ss');
  const dateString = moment(date).locale('fa').format('YYYY/MM/DD dddd');

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-700 bg-white/50 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-primary-600" />
        <span className="font-medium text-sm pt-1">{dateString}</span>
      </div>
      <div className="hidden sm:block h-4 w-px bg-slate-300"></div>
      <div className="flex items-center gap-2">
        <ClockIcon className="w-4 h-4 text-primary-600" />
        <span className="font-bold font-mono dir-ltr pt-1" style={{ direction: 'ltr' }}>{timeString}</span>
      </div>
    </div>
  );
};

export default Clock;