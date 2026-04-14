import { createMutation } from "../api/mutation"

export const useContactUs = createMutation({
  url: "/contact",
  method: "POST",
})
