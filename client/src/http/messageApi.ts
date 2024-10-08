import {$host} from "./index";

export const getConversations = async () => {
  const { data: response } = await $host.get('message/conversations/your-conversations');
  return response;
}

export const getMessages = async (conversationId: number) => {
  const { data: response } = await $host.get(`message/${conversationId}`);
  return response;
}

export const sendMessage = async (message: string, receiverId: number) => {
  const { data: response } = await $host.post(`message/send/${receiverId}`, { message});
  return response;
}

export const createGroupConversation = async ( groupName: string, participants: number[]) => {
  const { data: response } = await $host.post(`message/group/create`, { groupName, participants });
  return response;
}

export const sendGroupMessage = async (message: string, conversationId: number) => {
  const { data: response } = await $host.post(`message/group/${conversationId}/send`, { message });
  return response;
}
