import { validationResult } from "express-validator";

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorData = {};
    errors.array().forEach((error) => {
      errorData[error.path] = error.msg;
    });
    return res.status(422).json({ errorData });
  }
  next();
}
