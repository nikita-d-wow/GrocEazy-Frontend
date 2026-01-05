import React, { type FC } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];

  onChange: (_value: [number, number]) => void;
}

const PriceRangeSlider: FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin <= value[1]) {
      onChange([newMin, value[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax >= value[0]) {
      onChange([value[0], newMax]);
    }
  };

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative pt-8 pb-4">
      {/* Display Values with subtle badges */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
            Min
          </span>
          <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            ₹{value[0]}
          </span>
        </div>
        <div className="h-px w-4 bg-gray-200 mt-4" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
            Max
          </span>
          <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            ₹{value[1]}
          </span>
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="relative px-1">
        {/* Slider Track Background */}
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
          {/* Active Range Overlay */}
          <div
            className="absolute h-full bg-green-500 transition-all duration-150"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Range Inputs - Overlaid on the track */}
        <div className="relative h-1.5 -mt-1.5">
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={handleMinChange}
            className="absolute w-full appearance-none bg-transparent pointer-events-none z-30
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 
              [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing
              [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(34,197,94,0.3)] [&::-webkit-slider-thumb]:transition-transform
              hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute w-full appearance-none bg-transparent pointer-events-none z-40
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 
              [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing
              [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(34,197,94,0.3)] [&::-webkit-slider-thumb]:transition-transform
              hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
