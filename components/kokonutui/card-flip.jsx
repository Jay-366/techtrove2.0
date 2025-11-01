"use client";;
/**
 * @author: @dorian_baffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";

export default function CardFlip({
    title = "Design Systems",
    subtitle = "Explore the fundamentals",
    description = "Dive deep into the world of modern UI/UX design.",
    features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"]
}) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative w-full max-w-[280px] h-[320px] group [perspective:2000px]"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}>
            <div
                className={cn(
                    "relative w-full h-full",
                    "[transform-style:preserve-3d]",
                    "transition-all duration-700",
                    isFlipped
                        ? "[transform:rotateY(180deg)]"
                        : "[transform:rotateY(0deg)]"
                )}>
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(0deg)]",
                        "overflow-hidden rounded-2xl",
                        "border",
                        "shadow-xs",
                        "transition-all duration-700",
                        "group-hover:shadow-lg",
                        isFlipped ? "opacity-0" : "opacity-100"
                    )}
                    style={{ 
                        backgroundColor: 'rgba(93, 96, 108, 0.1)',
                        borderColor: 'rgba(251, 237, 224, 0.2)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 0 30px oklch(97.1% 0.014 343.198 / 0.3)'
                    }}>
                    <div
                        className="relative h-full overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(251, 237, 224, 0.05) 0%, rgba(93, 96, 108, 0.1) 100%)'
                        }}>
                        <div className="absolute inset-0 flex items-start justify-center pt-24">
                            <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute w-[50px] h-[50px]",
                                            "rounded-[140px]",
                                            "animate-[scale_3s_linear_infinite]",
                                            "opacity-0",
                                            "group-hover:animate-[scale_2s_linear_infinite]"
                                        )}
                                        style={{
                                            animationDelay: `${i * 0.3}s`,
                                            boxShadow: `0 0 50px oklch(${i % 2 === 0 ? '89.9% 0.061 343.231' : '91.7% 0.08 205.041'} / 0.5)`
                                        }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="space-y-1.5">
                                <h3
                                    className="text-lg font-semibold leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]"
                                    style={{ color: '#ffffff' }}>
                                    {title}
                                </h3>
                                <p
                                    className="text-sm line-clamp-2 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]"
                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {subtitle}
                                </p>
                            </div>
                            <div className="relative group/icon">
                                <div
                                    className={cn(
                                        "absolute inset-[-8px] rounded-lg transition-opacity duration-300"
                                    )}
                                    style={{
                                        background: 'linear-gradient(135deg, oklch(97.1% 0.014 343.198 / 0.2), oklch(98.4% 0.019 200.873 / 0.1))'
                                    }} />
                                <Repeat2
                                    className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12"
                                    style={{ 
                                        color: '#ffffff',
                                        filter: 'drop-shadow(0 0 10px oklch(97.1% 0.014 343.198 / 0.6))'
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        "p-6 rounded-2xl",
                        "border",
                        "shadow-xs",
                        "flex flex-col",
                        "transition-all duration-700",
                        "group-hover:shadow-lg",
                        !isFlipped ? "opacity-0" : "opacity-100"
                    )}
                    style={{
                        background: 'linear-gradient(135deg, rgba(251, 237, 224, 0.05) 0%, rgba(93, 96, 108, 0.1) 100%)',
                        borderColor: 'rgba(251, 237, 224, 0.2)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 0 30px oklch(97.1% 0.014 343.198 / 0.3)'
                    }}>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h3
                                className="text-lg font-semibold leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]"
                                style={{ color: '#ffffff' }}>
                                {title}
                            </h3>
                            <p
                                className="text-sm tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] line-clamp-2"
                                style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2 text-sm transition-all duration-500"
                                    style={{
                                        transform: isFlipped
                                            ? "translateX(0)"
                                            : "translateX(-10px)",
                                        opacity: isFlipped ? 1 : 0,
                                        transitionDelay: `${
                                            index * 100 + 200
                                        }ms`,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }}>
                                    <ArrowRight 
                                        className="w-3 h-3" 
                                        style={{ 
                                            color: '#ffffff',
                                            filter: 'drop-shadow(0 0 5px oklch(97.1% 0.014 343.198 / 0.8))'
                                        }} 
                                    />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div 
                        className="pt-6 mt-6 border-t" 
                        style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div
                            className={cn(
                                "group/start relative",
                                "flex items-center justify-between",
                                "p-3 -m-3 rounded-xl",
                                "transition-all duration-300",
                                "hover:scale-[1.02] hover:cursor-pointer"
                            )}
                            style={{
                                background: 'rgba(93, 96, 108, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, oklch(97.1% 0.014 343.198 / 0.1), oklch(98.4% 0.019 200.873 / 0.05))'
                                }
                            }}>
                            <span
                                className="text-sm font-medium transition-colors duration-300"
                                style={{ 
                                    color: '#ffffff',
                                    filter: 'drop-shadow(0 0 5px oklch(97.1% 0.014 343.198 / 0.5))'
                                }}>
                                Get Started
                            </span>
                            <div className="relative group/icon">
                                <div
                                    className={cn(
                                        "absolute inset-[-6px] rounded-lg transition-all duration-300",
                                        "opacity-0 group-hover/start:opacity-100 scale-90 group-hover/start:scale-100"
                                    )}
                                    style={{
                                        background: 'linear-gradient(135deg, oklch(97.1% 0.014 343.198 / 0.2), oklch(98.4% 0.019 200.873 / 0.1))'
                                    }} />
                                <ArrowRight
                                    className="relative z-10 w-4 h-4 transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110"
                                    style={{ 
                                        color: '#ffffff',
                                        filter: 'drop-shadow(0 0 10px oklch(97.1% 0.014 343.198 / 0.6))'
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes scale {
                    0% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0px 0px 50px oklch(89.9% 0.061 343.231 / 0.5);
                    }
                    50% {
                        transform: translate(0px, -5px) scale(1);
                        opacity: 1;
                        box-shadow: 0px 8px 20px oklch(91.7% 0.08 205.041 / 0.5);
                    }
                    100% {
                        transform: translate(0px, 5px) scale(0.1);
                        opacity: 0;
                        box-shadow: 0px 10px 20px oklch(89.9% 0.061 343.231 / 0);
                    }
                }
            `}</style>
        </div>
    );
}
