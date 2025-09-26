import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;