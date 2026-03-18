import { toast } from "sonner";

export type CustomError = {
  response: {
    data: {
      errors: {
        location: string;
        message: string;
        path: string;
      }[];
      message: string;
    };
  };
  message: string;
};

const handleResponseError = (err: CustomError) => {
  if (err?.message && !err.response.data) {
    toast.error(err.message);
    return;
  }
  if (err && err.response.data) {
    const { message, errors } = err.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((error) => {
        return toast.error(error.message);
      });
      return;
    }
    if (message) {
      toast.error(message);

      return;
    }

    if (typeof errors === "string") {
      toast.error(errors);

      return;
    }
  } else {
    console.log(err);
  }
};

export default handleResponseError;
