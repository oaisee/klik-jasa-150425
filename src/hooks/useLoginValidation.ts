
import { useState } from 'react';

interface LoginErrors {
  email?: string;
  password?: string;
}

export const useLoginValidation = () => {
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateForm = (email: string, password: string) => {
    const newErrors: LoginErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Kata sandi wajib diisi";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    setErrors,
    validateForm
  };
};
