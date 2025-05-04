import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltipContent: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  children: React.ReactElement;
}

export const Tooltip = ({
  tooltipContent,
  position = 'top',
  delay = 300,
  children,
  className,
  ...props
}: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });
  const childRef = React.useRef<HTMLElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updateTooltipPosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updateTooltipPosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = childRect.top + scrollY - tooltipRect.height - 8;
        left = childRect.left + scrollX + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'right':
        top = childRect.top + scrollY + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.right + scrollX + 8;
        break;
      case 'bottom':
        top = childRect.bottom + scrollY + 8;
        left = childRect.left + scrollX + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = childRect.top + scrollY + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.left + scrollX - tooltipRect.width - 8;
        break;
    }

    setTooltipPosition({ top, left });
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Cloner l'enfant pour ajouter les gestionnaires d'événements
  const child = React.cloneElement(children, {
    ref: childRef,
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
  });

  return (
    <>
      {child}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-sm max-w-xs",
            className
          )}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
          {...props}
        >
          {tooltipContent}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-800 transform rotate-45",
              position === 'top' && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
              position === 'right' && "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
              position === 'bottom' && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
              position === 'left' && "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
            )}
          />
        </div>
      )}
    </>
  );
};
