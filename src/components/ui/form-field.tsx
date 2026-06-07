import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
}

function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error ? (
        <p data-slot="form-message" className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p data-slot="form-hint" className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
