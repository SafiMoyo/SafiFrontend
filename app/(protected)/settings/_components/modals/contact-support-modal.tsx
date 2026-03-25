"use client"

import { FormEvent, useState } from "react"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ContactSupportModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ContactSupportModal({
  open,
  onOpenChange,
  onSuccess,
}: ContactSupportModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const resetForm = () => {
    setName("")
    setEmail("")
    setMessage("")
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    resetForm()
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm()
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-full !max-w-xl overflow-hidden rounded-md border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
      >
        <div className="bg-linear-to-r from-sky-50 via-primary/10 to-indigo-50 px-6 py-3 sm:px-8">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white/70 text-cyan-700">
            <MessageSquare size={14} />
          </div>
          <DialogTitle className="mt-3 text-center text-2xl font-extrabold tracking-tight">
            Contact Support
          </DialogTitle>
          <p className="mt-1 text-center text-sm text-slate-600">
            Tell us what you need and our team will get back to you.
          </p>
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="contact-name"
                >
                  Name
                </label>
                <Input
                  id="contact-name"
                  className="h-11 rounded-md border-slate-200 bg-slate-50"
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="contact-email"
                >
                  Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  className="h-11 rounded-md border-slate-200 bg-slate-50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="contact-message"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                className="min-h-32 w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed transition-colors outline-none placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                placeholder="How can we help you today?"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" className="h-11 rounded-md px-8">
                Submit
              </Button>
            </div>
          </form>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-sky-100 bg-sky-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <Mail size={16} className="mt-0.5 text-sky-700" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p>hello@safimoyo.com</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <Phone size={16} className="mt-0.5 text-emerald-700" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p>+2349079247149</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
