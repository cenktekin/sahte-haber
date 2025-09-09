import * as React from 'react'

type AlertProps = {
  title?: string
  description?: string
  intent?: 'info' | 'warning' | 'danger' | 'success'
} & React.HTMLAttributes<HTMLDivElement>

export function Alert({
  title,
  description,
  intent = 'info',
  className = '',
  ...rest
}: AlertProps) {
  const colors: Record<string, string> = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-black',
    danger: 'bg-red-600 text-white',
  }
  return (
    <div role="alert" className={`rounded-lg p-3 ${colors[intent]} ${className}`} {...rest}>
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="opacity-90 text-sm">{description}</div>}
    </div>
  )
}
