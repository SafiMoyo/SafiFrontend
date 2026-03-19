import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const AGE_GROUP_OPTIONS = [
  { value: "under-13", label: "Under 13" },
  { value: "13-17", label: "13–17" },
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35+", label: "35+" },
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
