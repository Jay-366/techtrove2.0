'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
} from 'react-aria-components';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300',
    /* Disabled */
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    /* Hover */
    'data-[hovered]:bg-[#5d606c]/20 data-[hovered]:border-[#f8ede0] data-[hovered]:shadow-[0_0_15px_rgba(248,237,224,0.1)]',
    /* Selected */
    'data-[selected]:bg-[#5d606c] data-[selected]:text-[#f8ede0] data-[selected]:border-[#f8ede0]',
    /* Focus Visible */
    'data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-[#f8ede0]/50 data-[focus-visible]:ring-offset-2',
    /* Resets */
    'focus-visible:outline-none',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent text-[#f8ede0]/60',
        outline:
          'border border-[#5d606c] bg-transparent text-[#f8ede0]/60 data-[selected]:text-[#f8ede0]',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Toggle({ className, variant, size, ...props }) {
  return (
    <AriaToggleButton
      className={composeRenderProps(
        className,
        (classNameVal) =>
          cn(
            'group-data-[orientation=vertical]/togglegroup:w-full',
            toggleVariants({
              variant,
              size,
              className: classNameVal,
            })
          )
      )}
      {...props}
    />
  );
}

function ToggleButtonGroup({ children, className, ...props }) {
  return (
    <AriaToggleButtonGroup
      className={composeRenderProps(
        className,
        (classNameVal) =>
          cn(
            'group/togglegroup flex items-center justify-center gap-1 data-[orientation=vertical]:flex-col',
            classNameVal
          )
      )}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  );
}

export { Toggle, toggleVariants, ToggleButtonGroup };
