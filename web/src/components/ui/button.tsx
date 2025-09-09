import * as React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2'
  const styles =
    variant === 'outline'
      ? 'border border-foreground/20 bg-transparent hover:bg-foreground/5'
      : 'bg-foreground text-background hover:bg-foreground/90'
  return <button className={`${base} ${styles} ${className}`} {...props} />
}
