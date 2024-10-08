import { $host } from './index'
import { getLocalStorage } from '../helpers/localsorage'

export const registration = async (data: {
  username: string;
  email: string;
  password: string;
  fullName: string;
}) => {
  const { data: response } = await $host.post('auth/signup', data);
  return response;
};

export const login = async (data: { email: string; password: string }) => {
  const { data: response } = await $host.post('auth/login', data);
  return response;
};

export const logout = async () => {
  const { data: response } = await $host.post('auth/logout');
  return response;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const { data: response } = await $host.post('auth/change-password', data);
  return response;
}


export const updatedAvatar = async (formData) => {
  const user = getLocalStorage('user');  // Извлекаем user из localStorage
  formData.append('userId', user.id);
  const response = await $host.post('auth/change-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // Обязательно указываем тип данных
    },
    withCredentials: true,  // Если нужно отправлять куки
  });
  return response.data;
};
