import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DEFAULT_AVATAR } from '@/lib/constants';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  online?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, online, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-20 h-20 text-xl',
    };

    const getInitials = (name?: string) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden rounded-full',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || 'Avatar'}
            fill
            className="object-cover"
            sizes={size}
            onError={(e) => {
              // 如果图片加载失败，隐藏图片元素，显示回退内容
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground">
            {fallback || getInitials(fallback)}
          </div>
        )}
        
        {/* 在线状态指示器 */}
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };