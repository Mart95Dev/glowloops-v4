"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface DualRangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  formatLabel?: (value: number) => string
  showLabel?: boolean
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      formatLabel = (value: number) => `${value}`,
      showLabel = true,
      ...props
    },
    ref
  ) => {
    const initialValue = props.defaultValue || props.value || [min, max]
    const [localValues, setLocalValues] = React.useState(initialValue)

    React.useEffect(() => {
      if (props.value) {
        setLocalValues(props.value)
      }
    }, [props.value])

    return (
      <div className={cn("space-y-4", className)}>
        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          className="relative flex w-full touch-none select-none items-center"
          {...props}
          onValueChange={(value) => {
            setLocalValues(value)
            props.onValueChange?.(value)
          }}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-lilas-fonce" />
          </SliderPrimitive.Track>
          {localValues.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className="block h-5 w-5 rounded-full border-2 border-lilas-fonce bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </SliderPrimitive.Root>
        {showLabel && (
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              {formatLabel(localValues[0])}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatLabel(localValues[1])}
            </div>
          </div>
        )}
      </div>
    )
  }
)

DualRangeSlider.displayName = "DualRangeSlider"

export { DualRangeSlider }
