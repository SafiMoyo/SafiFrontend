"use client"

import { FormEvent, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useContactUs } from "@/services/contact/mutations"
import { toast } from "sonner"

type FormState = { name: string; email: string; message: string }
const EMPTY: FormState = { name: "", email: "", message: "" }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }))

  const { mutate, isPending } = useContactUs({
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you shortly.")
      setForm(EMPTY)
      onOpenChange(false)
    },
    onError: () => toast.error("Failed to send message. Please try again."),
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ name: form.name, email: form.email, message: form.message })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md gap-0 rounded-lg bg-white p-8">
        <DialogTitle className="mb-1 text-2xl font-extrabold text-gray-900">
          Contact Us
        </DialogTitle>
        <p className="mb-6 text-sm text-gray-500">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Name</Label>
            <Input
              variant="auth"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Email</Label>
            <Input
              variant="auth"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Message</Label>
            <textarea
              placeholder="Type your message here…"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              required
              rows={5}
              className="w-full resize-none rounded-xl border border-purple-200 bg-purple-50/40 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-full"
            disabled={
              !form.name.trim() ||
              !form.email.trim() ||
              !form.message.trim() ||
              isPending
            }
            loading={isPending}
          >
            Send Message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
