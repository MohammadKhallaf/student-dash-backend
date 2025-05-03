import * as yup from "yup";

export const updateUserValidation = yup.object().shape({
  body: yup.object().shape({
    name: yup.string().optional().typeError("Name must be a string"),
    username: yup.string().optional().typeError("Username must be a string"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address")
      .typeError("Email must be a string"),
    password: yup.string().optional().typeError("Password must be a string"),
    phone: yup.string().optional().typeError("Phone number must be a string"),
    address: yup.string().optional().typeError("Address must be a string"),
    role: yup
      .mixed()
      .oneOf(["user", "admin"])
      .default("user")
      .optional()
      .typeError("Role must be either user or admin"),
  }),
});
