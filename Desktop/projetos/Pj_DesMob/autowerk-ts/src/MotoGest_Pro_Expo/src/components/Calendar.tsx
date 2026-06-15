import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Appointment } from '../types';

interface CalendarProps {
  appointments: Appointment[];
  onDayPress?: (date: string) => void;
  selectedDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ appointments, onDayPress, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayApps = appointments.filter(a => a.date === dateStr);
      const isSelected = selectedDate === dateStr;
      
      days.push(
        <TouchableOpacity 
          key={i} 
          style={[styles.dayCell, isSelected && styles.selectedDay]}
          onPress={() => onDayPress && onDayPress(dateStr)}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{i}</Text>
          <View style={styles.indicators}>
            {dayApps.map((app, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.indicator, 
                  { backgroundColor: app.status === 'concluido' ? '#10b981' : '#f97316' }
                ]} 
              />
            ))}
          </View>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>{monthNames[month]} {year}</Text>
        <View style={styles.nav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <ChevronLeft color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <ChevronRight color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekRow}>
        {daysOfWeek.map(d => (
          <View key={d} style={styles.dayCell}>
            <Text style={styles.weekText}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {renderDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  monthTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    gap: 10,
  },
  navBtn: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 5,
    marginBottom: 10,
  },
  weekText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    borderRadius: 10,
  },
  selectedDay: {
    backgroundColor: '#f97316',
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 5,
    gap: 2,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default Calendar;
