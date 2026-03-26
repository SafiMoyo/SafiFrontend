import { toast } from "sonner"

export type CustomError = {
  response: {
    data: {
      errors: {
        location: string
        message: string
        path: string
      }[]
      message: string
    }
  }
  message: string
}

const handleResponseError = (err: CustomError) => {
  // Axios timeout errors usually have code ECONNABORTED and no response payload.

  if ((err as { code?: string })?.code === "ECONNABORTED") {
    toast.error("Request timed out. Please try again.")
    return
  }

  if (err?.message && !err?.response?.data) {
    toast.error(err.message)
    return
  }
  if (err?.response?.data) {
    const { message, errors } = err.response.data

    if (Array.isArray(errors)) {
      errors.forEach((error) => {
        return toast.error(error.message)
      })
      return
    }
    if (message) {
      toast.error(message)

      return
    }

    if (typeof errors === "string") {
      toast.error(errors)

      return
    }
  } else {
    console.log(err)
  }
}

export default handleResponseError
