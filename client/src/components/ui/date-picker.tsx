import { useState } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  startDate: Date;
  endDate: Date;
  onChangeStartDate: (date: Date) => void;
  onChangeEndDate: (date: Date) => void;
  maxDays?: number;
}

export function DatePicker({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  maxDays = 7,
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<"start" | "end">("start");

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    if (currentDate === "start") {
      onChangeStartDate(date);
      // Auto-set end date if not yet set
      if (endDate <= date) {
        const newEndDate = addDays(date, 1);
        onChangeEndDate(newEndDate);
      }
      setCurrentDate("end");
    } else {
      onChangeEndDate(date);
      setIsPopoverOpen(false);
    }
  };

  const dateFormatter = (date: Date) => {
    return format(date, "EEE, MMM d");
  };

  return (
    <div className="bg-secondary rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-2">Select date</p>
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-xl font-medium">{dateFormatter(startDate)}</h3>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 h-auto p-1">
              <Edit className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={currentDate === "start" ? startDate : endDate}
              onSelect={handleSelectDate}
              initialFocus
              disabled={(date) => {
                if (currentDate === "start") {
                  return date < new Date();
                } else {
                  return (
                    date < startDate ||
                    date > addDays(startDate, maxDays - 1)
                  );
                }
              }}
            />
            <div className="p-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {currentDate === "start" ? "Select Start Date" : "Select End Date"}
                </span>
                {currentDate === "end" && (
                  <span className="text-xs text-muted-foreground">
                    Max {maxDays} days
                  </span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <select className="bg-transparent text-sm font-medium pr-8">
          <option>{format(startDate, "MMMM yyyy")}</option>
        </select>
        <div className="flex space-x-2">
          <button className="w-6 h-6 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded-full">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        <div className="text-xs font-medium">S</div>
        <div className="text-xs font-medium">M</div>
        <div className="text-xs font-medium">T</div>
        <div className="text-xs font-medium">W</div>
        <div className="text-xs font-medium">T</div>
        <div className="text-xs font-medium">F</div>
        <div className="text-xs font-medium">S</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const isStartDate = day === startDate.getDate();
          const isEndDate = day === endDate.getDate();
          const isInRange = day > startDate.getDate() && day < endDate.getDate();
          
          return (
            <div
              key={i}
              className={cn(
                "py-1",
                isStartDate && "bg-primary text-white rounded-full",
                isEndDate && "bg-primary text-white rounded-full",
                isInRange && "bg-primary/20 text-primary rounded-full"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
