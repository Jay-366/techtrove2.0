import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  Star,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

// Card variants
const cardVariants = cva(
  'group relative w-full overflow-hidden shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        glass: 'backdrop-blur-xl border-[#5d606c]/30',
        solid: 'bg-[#1C1F2B] border-[#5d606c]/50',
      },
      size: {
        sm: 'rounded-lg p-2.5 gap-2 text-sm',
        md: 'rounded-xl p-3 gap-2.5 text-base',
        lg: 'rounded-2xl p-5 gap-3 text-lg',
      },
      hover: {
        lift: 'hover:shadow-2xl hover:-translate-y-2',
        glow: 'hover:shadow-[0_0_30px_rgba(248,237,224,0.2)]',
        scale: 'hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
      hover: 'lift',
    },
  }
);

// Badge variants
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm font-medium shadow-xs transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'border-[#5d606c]/30 bg-[#171a24]/60 text-[#f8ede0]',
        success:
          'border-green-500/30 bg-green-950/60 text-green-400',
        warning:
          'border-yellow-500/30 bg-yellow-950/60 text-yellow-400',
        info: 'border-blue-500/30 bg-blue-950/60 text-blue-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Button variants
const actionButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold ring-offset-background transition-all duration-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[#f8ede0] text-[#161823] hover:bg-[#f8ede0]/90 shadow-md hover:shadow-lg',
        secondary:
          'bg-[#5d606c] text-[#f8ede0] hover:bg-[#5d606c]/90 shadow-md',
        ghost:
          'bg-transparent text-[#f8ede0] hover:bg-[#5d606c]/20 border border-[#5d606c]/30',
        outline:
          'bg-background text-[#f8ede0] border border-[#5d606c]/50 hover:bg-[#5d606c]/10',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-10 rounded-lg px-4 text-sm',
        lg: 'h-12 rounded-lg px-6 text-base',
      },
      hover: {
        scale: 'hover:scale-105',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      hover: 'scale',
    },
  }
);

export const TradingOracleCard = React.forwardRef(function TradingOracleCard(
  {
    className,
    variant,
    size,
    hover,
    title = 'Trading Oracle',
    category = 'Trading',
    description = 'Advanced market analysis and trading strategies powered by AI',
    price = 1000,
    pricePeriod = 'tokens/query',
    rating = 4.8,
    users = 12500,
    trending = false,
    featured = false,
    onViewDetails,
    revealOnHover = true,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, hover }),
        'border cursor-pointer hover:border-[#f8ede0]/50',
        className
      )}
      style={{
        background:
          variant === 'glass' ? 'rgba(28, 31, 43, 0.6)' : undefined,
      }}
      onClick={onViewDetails}
      {...props}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5d606c]/10 via-transparent to-[#161823]/20 pointer-events-none" />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8ede0]/5 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative flex h-full min-h-[200px] flex-col justify-end">
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-0 left-0 right-0 flex justify-start mb-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#f8ede0]/50 bg-gradient-to-r from-[#5d606c]/40 to-[#171a24]/60 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-[#f8ede0] shadow-lg">
              <Sparkles className="h-3.5 w-3.5 fill-[#f8ede0]" />
              FEATURED AGENT
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-0 right-0">
          <span
            className={cn(
              badgeVariants({ variant: 'primary', size: 'md' })
            )}
          >
            {category}
          </span>
        </div>

        {/* Main content wrapper */}
        <div className="space-y-1.5 transition-transform duration-500 ease-in-out group-hover:-translate-y-14">
          {/* Title + Desc */}
          <div className="space-y-1.5">
            <div>
              <h3 className="text-lg font-bold text-[#f8ede0] leading-tight tracking-tight">
                {title}
              </h3>
            </div>
            <div>
              <p className="text-[11px] text-[#f8ede0]/70 leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 py-1.5 text-[11px] text-[#f8ede0]/80 border-t border-[#5d606c]/20">
            <span className="flex items-center gap-1 group/rating">
              <Star className="h-2.5 w-2.5 fill-[#f8ede0] text-[#f8ede0] group-hover/rating:scale-110 transition-transform" />
              <span className="font-semibold">
                {Number(rating).toFixed(1)}
              </span>
            </span>
            <span className="flex items-center gap-1 group/users">
              <Users className="h-2.5 w-2.5 group-hover/users:scale-110 transition-transform" />
              <span className="font-medium">
                {Number(users).toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* Bottom Section: Price & CTA */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 pb-2.5 transition-all duration-500 ease-in-out',
            revealOnHover
              ? 'translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
              : 'translate-y-0 opacity-100'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-[#f8ede0]">
                {price}
              </span>
              <span className="text-[#f8ede0]/70 text-[9px] self-end pb-0.5">
                {pricePeriod}
              </span>
            </div>

            {/* CTA */}
            <button
              className={cn(
                actionButtonVariants({
                  variant: 'primary',
                  size: 'sm',
                  hover: 'scale',
                }),
                'h-7 px-2.5 text-[11px]'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails && onViewDetails();
              }}
              aria-label={`View details for ${title}`}
            >
              View
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export { cardVariants as tradingCardVariants, badgeVariants as tradingBadgeVariants, actionButtonVariants as tradingActionButtonVariants };
