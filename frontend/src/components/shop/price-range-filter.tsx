"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/redux/features/productFilterSlice";
import { RootState } from "@/redux/store";

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  step?: number;
  onFilterChange?: (range: { min: number; max: number }) => void;
}

export function PriceRangeFilter({
  minPrice = 0,
  maxPrice = 1000,
  step = 10,
}: PriceRangeFilterProps) {
  const dispatch = useDispatch();

  const filterValues = useSelector((state: RootState) => state.productFilter);

  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);

  const minPos = ((minVal - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPos = ((maxVal - minPrice) / (maxPrice - minPrice)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
  };

  const handleApplyFilter = () => {
    dispatch(setFilters({ minPrice: minVal, maxPrice: maxVal }));
  };
  console.log(filterValues);

  return (
    <Card className="p-6">
      {/* হেডার */}
      <div className="mb-6 border-b-2 border-primary pb-3">
        <h3 className="font-heading text-lg font-bold text-secondary">
          Price Range
        </h3>
      </div>

      {/* স্লাইডার কনটেইনার */}
      <div className="relative mb-6 pt-2 pb-2">
        {/* ব্যাকগ্রাউন্ড ট্র্যাক */}
        <div className="h-2 rounded-md bg-secondary/10 w-full absolute top-1/2 -translate-y-1/2" />

        {/* প্রাইমারি কালারের একটিভ ফিল্ড */}
        <div
          className="h-2 rounded-md bg-primary absolute top-1/2 -translate-y-1/2"
          style={{
            left: `${minPos}%`,
            right: `${100 - maxPos}%`,
          }}
        />

        {/* মাইনাস (Min) রেঞ্জ ইনপুট */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 z-30 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
        />

        {/* ম্যাক্স (Max) রেঞ্জ ইনপুট */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 z-40 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
        />
      </div>

      {/* প্রাইস ভ্যালু ও ফিল্টার বাটন */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <span>Price:</span>
          <span className="font-semibold text-secondary">
            ${minVal} — ${maxVal}
          </span>
        </div>

        <Button
          onClick={handleApplyFilter}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4"
        >
          Filter
        </Button>
      </div>
    </Card>
  );
}
