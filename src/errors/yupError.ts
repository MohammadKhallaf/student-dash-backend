import type { ValidationError } from "yup";

export const handleYupError = (err: ValidationError) => {
  const errors = err.inner.map((error) => {
    return {
      path: error.path || "", // Yup errors have a path property
      message: error.message,
    };
  });

  // If no inner errors (simple validation), use the main error
  if (errors.length === 0 && err.path) {
    return [
      {
        path: err.path,
        message: err.message,
      },
    ];
  }

  return errors;
};
