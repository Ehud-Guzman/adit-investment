import { useRef, useState, useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  max = 99,
  min = 1,
  size = "base",
}) => {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(quantity));

  // Sync input value with external quantity changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(quantity));
    }
  }, [quantity, isEditing]);

  const sizeClasses = {
    sm: {
      container: "h-9",
      button: "w-9",
      icon: "text-xs",
      input: "w-10 text-sm",
    },
    base: {
      container: "h-11",
      button: "w-11",
      icon: "text-base",
      input: "w-12 text-base",
    },
    lg: {
      container: "h-13",
      button: "w-13",
      icon: "text-lg",
      input: "w-14 text-lg",
    },
  };

  const handleManualChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value === "") {
      setIsEditing(true);
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const clamped = Math.min(Math.max(min, numValue), max);
    setInputValue(String(clamped));
    
    const diff = clamped - quantity;
    if (diff > 0) {
      onIncrease(diff);
    } else if (diff < 0) {
      onDecrease(-diff);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue === "") {
      setInputValue(String(min));
      onDecrease(quantity - min);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm transition-all ${
          sizeClasses[size].container
        } ${isEditing ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
        aria-label={`Quantity selector, current value: ${quantity}`}
      >
        <button
          onClick={() => onDecrease(1)}
          disabled={quantity <= min}
          className={`h-full flex items-center justify-center bg-gray-50 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-50 transition-colors focus:outline-none focus:bg-blue-100 text-gray-600 hover:text-blue-600 ${
            sizeClasses[size].button
          }`}
          aria-label="Decrease quantity"
        >
          <FiMinus className={sizeClasses[size].icon} />
        </button>

        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleManualChange}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") inputRef.current.blur();
          }}
          className={`h-full text-center font-medium border-x border-gray-200 focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            sizeClasses[size].input
          }`}
          min={min}
          max={max}
          aria-label="Quantity"
        />

        <button
          onClick={() => onIncrease(1)}
          disabled={quantity >= max}
          className={`h-full flex items-center justify-center bg-gray-50 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-50 transition-colors focus:outline-none focus:bg-blue-100 text-gray-600 hover:text-blue-600 ${
            sizeClasses[size].button
          }`}
          aria-label="Increase quantity"
        >
          <FiPlus className={sizeClasses[size].icon} />
        </button>
      </div>
      
      {quantity >= max && (
        <p className="text-xs text-rose-500 font-medium px-1">
          
        </p>
      )}
    </div>
  );
};

export default QuantitySelector;