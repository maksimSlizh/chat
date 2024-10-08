import {$host} from "./index";

export const searchUsersByUsername = async (username: string) => {
  const { data: response } = await $host.get(`/users/${username}`);
  return response;
};

export const getAllUsers = async () => {
  const { data: response } = await $host.get('/users/users/all');
  return response;
}
