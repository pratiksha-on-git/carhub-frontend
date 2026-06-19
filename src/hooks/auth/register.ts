import * as React from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";

type DealerRegistrationPayload = {
  businessName: string;
  ownerName: string;
  gstNumber: string;
  yearsInBusiness: number;
  mobile: string;
  whatsapp: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
};

/** Structured error thrown when the API returns a non-2xx response */
export class ApiError extends Error {
  status: number;
  /** Field-level validation errors from the 400 response */
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function useRegister() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const registerDealer = React.useCallback(
    async (payload: DealerRegistrationPayload, dealerLogo: File, showroomImage: File) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append(
          "dealer",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
        formData.append("dealerLogo", dealerLogo);
        formData.append("showroomImage", showroomImage);

        const { data: body } = await apiClient.post("/api/dealer/register", formData);
        return body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new ApiError(
            body?.message ?? err.message,
            body?.status ?? err.response?.status ?? 500,
            body?.errors,
          );
        }
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { isSubmitting, registerDealer };
}
