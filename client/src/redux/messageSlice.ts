import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConversations, getMessages, sendMessage as apiSendMessage, sendGroupMessage as apiSendGroupMessage } from '../http/messageApi';

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ message, receiverId }, { dispatch, getState }) => {
    const response = await apiSendMessage(message, receiverId);
    const { selectedConversation, selectedUser } = getState().message;

    if (selectedUser) {
      await dispatch(fetchConversations());
      const { conversations } = getState().message;
      const newConversation = conversations.find(conversation =>
        conversation.otherParticipants.some(participant => participant.id === receiverId)
      );
      dispatch(selectConversation(newConversation));
      dispatch(fetchMessages(newConversation.id));
    } else {
      await dispatch(fetchMessages(selectedConversation.id));
    }

    return response;
  }
);

export const sendGroupMessage = createAsyncThunk(
  'messages/sendGroupMessage',
  async ({ message, conversationId }, { dispatch }) => {
    const response = await apiSendGroupMessage(message, conversationId);


    await dispatch(fetchMessages(conversationId))
    return response;
  }
);

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (conversationId) => {
  const response = await getMessages(conversationId);
  return response;
});

export const fetchConversations = createAsyncThunk('messages/fetchConversations', async () => {
  const response = await getConversations();
  return response;
});

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    selectedConversation: null,
    selectedUser: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addNewMessage: (state, action) => {
      state.messages.push(action.payload); // Добавляем новое сообщение
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const newMessage = action.payload.newMessage;

        // Проверяем, существует ли сообщение с таким же ID
        const messageExists = state.messages.some(msg => msg.id === newMessage.id);

        if (!messageExists) {
          state.messages.push(newMessage);
        }
      })
      .addCase(sendGroupMessage.fulfilled, (state, action) => {
        const newMessage = action.payload.newMessage; // Предполагается, что ответ содержит новое сообщение

        // Проверяем, существует ли сообщение с таким же ID
        const messageExists = state.messages.some(msg => msg.id === newMessage.id);

        if (!messageExists) {
          state.messages.push(newMessage); // Добавляем новое сообщение для группового чата
        }
      })
      .addCase('messages/newMessage', (state, action) => {
        const newMessage = action.payload;

        // Проверяем, существует ли сообщение с таким же ID
        const messageExists = state.messages.some(msg => msg.id === newMessage.id);

        if (!messageExists) {
          state.messages.push(newMessage);
        }
      });;
  },
});

export const { clearConversations, selectConversation, clearMessages, setSelectedUser, addNewMessage } = messageSlice.actions;
export default messageSlice.reducer;
