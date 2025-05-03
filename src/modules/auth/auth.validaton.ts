import * as yup from "yup";

// Define the Yup schema for IUser
export const createUserValidation = yup.object().shape({
  body: yup.object().shape({
    name: yup
      .string()
      .required("Username is required")
      .typeError("Username must be a string"),
    username: yup
      .string()
      .required("Username is required")
      .typeError("Username must be a string"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address")
      .typeError("Email must be a string"),
    password: yup
      .string()
      .required("Password is required")
      .typeError("Password must be a string"),
    role: yup
      .mixed()
      .oneOf(["user", "admin"])
      .default("user")
      .required("Role is required")
      .typeError("Role must be either user or admin"),
  }),
});

// For Activation
export const activateUserValidation = yup.object().shape({
  body: yup.object().shape({
    activationToken: yup
      .string()
      .required("Token is required")
      .typeError("Token must be a string"),
    code: yup
      .string()
      .required("Code is required")
      .typeError("Code must be a string"),
  }),
});

export const loginValidation = yup.object().shape({
  body: yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address")
      .typeError("Email must be a string"),
    password: yup
      .string()
      .required("Password is required")
      .typeError("Password must be a string"),
  }),
});
