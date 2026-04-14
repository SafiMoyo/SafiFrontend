import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const AGE_GROUP_OPTIONS = [
  { value: "Early Level 4-8", label: "Early Level 4–8" },
  { value: "Middle Level 9-13", label: "Middle Level 9–13" },
  { value: "Advanced 14-18", label: "Advanced 14–18" },
]

type AgeGroupSelectProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function AgeGroupSelect({ value, onChange, className }: AgeGroupSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger variant="auth" className={`h-11 ${className ?? ""}`}>
        <SelectValue placeholder="Select age group" />
      </SelectTrigger>
      <SelectContent>
        {AGE_GROUP_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
