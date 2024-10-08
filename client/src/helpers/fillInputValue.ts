export const validateSignupData = (
  email: string,
  password: string,
  fullName: string,
  username: string,
  confirmPassword: string
): boolean => {
  if (!email || !password || !fullName || !username) {
    return false;
  }

  if (password !== confirmPassword) {
    return false;
  }

  if (password.length < 6) {
    return false;
  }

  return true;
}

// Функция для валидации данных при логине
export const validateLoginData = (email: string, password: string): boolean => {
  if (!email || !password) {
    return false;
  }

  return true;
}

export const fillInputValueLogin = (email: string, password: string) => {
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
}
