import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';
import './Calendar.css';

interface CalendarProps {
  appointments: Appointment[];
  onDayClick: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ appointments, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDayAppointments = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(app => app.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDayClick(dateStr);
  };

  return (
    <div className="calendar-container animate-slideUp">
      <div className="calendar-header">
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <div className="calendar-nav">
          <button className="calendar-btn" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <button className="calendar-btn" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="day-cell empty" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayApps = getDayAppointments(day);
          
          return (
            <div 
              key={day} 
              className={`day-cell ${isToday(day) ? 'today' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{day}</span>
              <div className="indicators">
                {dayApps.map(app => (
                  <div key={app.id} className={`indicator ${app.status}`} title={`${app.servicos.join(', ')} - ${app.status}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
