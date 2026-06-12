import * as React from "react";

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
  dealerId: string;
  dealerLogo: string;
  showroomImage: string;
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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export function useRegister() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const registerDealer = React.useCallback(
    async (payload: DealerRegistrationPayload) => {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/dealer/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Try to parse body as JSON regardless of status
        let body: {
          message?: string;
          status?: number;
          errors?: Record<string, string>;
          data?: unknown;
        } = {};
        try {
          body = await response.json();
        } catch {
          // Non-JSON body — fall back to status text
        }

        if (!response.ok) {
          throw new ApiError(
            body.message ?? response.statusText,
            body.status ?? response.status,
            body.errors,
          );
        }

        return body;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { isSubmitting, registerDealer };
}
