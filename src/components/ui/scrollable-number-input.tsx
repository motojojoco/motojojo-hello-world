import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './button';

interface ScrollableNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
  showArrows?: boolean;
  showScrollHint?: boolean;
}

export const ScrollableNumberInput: React.FC<ScrollableNumberInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 15,
  label,
  className = '',
  disabled = false,
  showArrows = true,
  showScrollHint = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    const newValue = Math.max(min, Math.min(max, value + delta));
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.max(min, Math.min(max, value + 1));
      onChange(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(min, Math.min(max, value - 1));
      onChange(newValue);
    }
  };

  const increment = () => {
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={`${label ? 'space-y-2' : ''} ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`${showArrows ? 'pr-12' : ''} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            isFocused ? 'ring-2 ring-violet ring-offset-2' : ''
          }`}
        />
        
        {showArrows && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={increment}
              disabled={disabled || value >= max}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={decrement}
              disabled={disabled || value <= min}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {showScrollHint && (
        <div className="text-xs text-muted-foreground">
          Use scroll wheel, arrow keys, or click arrows to adjust ({min}-{max})
        </div>
      )}
    </div>
  );
}; 