"use client";

import React, { useState } from "react";
import { X, Calendar, ChevronLeft, ChevronRight, Pencil } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (fromDate: string, toDate: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [fromDate, setFromDate] = useState("23 Jul 2026");
  const [toDate, setToDate] = useState("23 Jul 2026");

  // Date Picker state
  const [activeDatePicker, setActiveDatePicker] = useState<"from" | "to" | null>(null);
  const [selectedDay, setSelectedDay] = useState(23);
  const [selectedMonth] = useState("July 2026");

  if (!isOpen) return null;

  const handleDateSelect = (day: number) => {
    setSelectedDay(day);
  };

  const confirmDatePicker = () => {
    const formatted = `${selectedDay} Jul 2026`;
    if (activeDatePicker === "from") {
      setFromDate(formatted);
    } else if (activeDatePicker === "to") {
      setToDate(formatted);
    }
    setActiveDatePicker(null);
  };

  const handleApplyFilter = () => {
    if (onApply) onApply(fromDate, toDate);
    onClose();
  };

  // Day names for header
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  // Days grid for July 2026 (Starts on Wed, July 1 -> 3 blank slots)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const blankSlots = [null, null, null];

  // Map day number to short day of week e.g. 23 -> "Thu, Jul 23"
  const getFormattedHeaderDate = (day: number) => {
    const dateObj = new Date(2026, 6, day);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${day}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center select-none font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-[430px] z-10 flex flex-col items-center animate-in slide-in-from-bottom duration-300">
        {/* Floating White Circular Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4A5568] border border-slate-100 hover:scale-105 active:scale-95 transition-all mb-3 cursor-pointer z-20"
          aria-label="Close"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Bottom Sheet Card */}
        <div className="w-full bg-white rounded-t-[32px] px-6 pt-6 pb-8 flex flex-col items-center shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
          {/* Title */}
          <h2 className="text-[24px] font-extrabold text-black tracking-tight text-center mb-6 font-sans">
            Filter!
          </h2>

          {/* Date Range Inputs Row */}
          <div className="w-full flex items-center space-x-3 mb-8">
            {/* From Date Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveDatePicker("from");
                setSelectedDay(parseInt(fromDate.split(" ")[0]) || 23);
              }}
              className="flex-1 bg-white border border-slate-200/90 rounded-full px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between hover:border-[#1C82D9] transition-all cursor-pointer"
            >
              <span className="text-[#1C82D9] font-bold text-[14px]">
                {fromDate}
              </span>
              <Calendar className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            </button>

            {/* To Date Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveDatePicker("to");
                setSelectedDay(parseInt(toDate.split(" ")[0]) || 23);
              }}
              className="flex-1 bg-white border border-slate-200/90 rounded-full px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between hover:border-[#1C82D9] transition-all cursor-pointer"
            >
              <span className="text-[#1C82D9] font-bold text-[14px]">
                {toDate}
              </span>
              <Calendar className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            </button>
          </div>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApplyFilter}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_6px_20px_rgba(49,169,246,0.35)] transition-all cursor-pointer flex items-center justify-center tracking-wide font-sans text-center"
          >
            Apply
          </button>
        </div>
      </div>

      {/* DATE PICKER DIALOG (Material Style) */}
      {activeDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop for Date Picker */}
          <div
            onClick={() => setActiveDatePicker(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
          />

          {/* Date Picker Modal Card */}
          <div className="relative z-10 bg-white rounded-[28px] p-6 max-w-[320px] w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            {/* Top Header */}
            <div className="border-b border-slate-200 pb-3">
              <span className="block text-[12px] font-semibold text-slate-600">
                Select date
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[26px] font-bold text-slate-900 leading-tight">
                  {getFormattedHeaderDate(selectedDay)}
                </span>
                <Pencil className="w-5 h-5 text-slate-700 cursor-pointer hover:opacity-80" />
              </div>
            </div>

            {/* Month & Year Navigation */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                className="text-slate-800 font-bold text-[14px] flex items-center space-x-1 cursor-pointer"
              >
                <span>{selectedMonth}</span>
                <span className="text-[10px]">▼</span>
              </button>

              <div className="flex items-center space-x-2 text-slate-600">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Names Grid */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 py-1">
              {dayNames.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 text-center text-sm font-medium gap-y-1">
              {/* Blank Slots before 1st */}
              {blankSlots.map((_, i) => (
                <span key={`blank-${i}`} />
              ))}

              {/* Days 1..31 */}
              {daysInMonth.map((day) => {
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1C82D9] text-white font-bold shadow-sm"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end space-x-6 pt-2">
              <button
                type="button"
                onClick={() => setActiveDatePicker(null)}
                className="text-[#1C82D9] font-bold text-[14px] hover:opacity-80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDatePicker}
                className="text-[#1C82D9] font-bold text-[14px] hover:opacity-80 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
