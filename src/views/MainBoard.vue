<template>
  <div class="chat-container" ref="mainBoardRef">
    <Sidebar
      v-show="showSidebar"
      :chatList="chatList"
      @new-chat="handleNewChat"
      @select-chat="handleSelectChat"
      @copy-chat="handleCopyChat"
      @delete-chat="handleDeleteChat"
      @favorite-chat="handleFavoriteChat"
      @select-menu="handleSelectMenu"
      @toggle-sidebar="handleToggleSidebar"
      @edit-chat="handleEditChat"
    />
    <PageLayout
      :title="currentMenu.label"
      :show-sidebar="showSidebar"
      :is-chat="currentMenu.key === 'chat'"
      @toggle-sidebar="handleToggleSidebar"
      @edit-chat="handleEditChat"
      @search="handleSearch"
      @history="handleHistory"
      @menu-click="handleMenuAction"
    >
      <Settings v-if="currentMenu.key === 'settings'" />
      <AboutMe v-if="currentMenu.key === 'about'" />
    </PageLayout>

    <!-- 替换原有的编辑对话框 -->
    <!-- <EditChatDialog
      v-model:visible="editModalVisible"
      :current-chat="currentEditChat"
      :parent-height="mainBoardHeight"
      @save="handleEditSave"
      @cancel="handleCancelEdit"
    /> -->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import Sidebar from './Sidebar.vue';
import PageLayout from './PageLayout.vue';
// import ChatPanel from './ChatPanel.vue';
import Settings from './settings/index.vue';
import Toolbox from './toolbox/index.vue';
import AboutMe from './aboutme/index.vue';
// import INextChatService from '@/intellichat/services/INextChatService';
// import createService from '@/intellichat/services';
// import useChatContext from '@/hooks/useChatContext';
// import { IChatResponseMessage } from '@/intellichat/types';
// import { isBlank } from '@/common/utils/validators';
// import EditChatDialog from './EditChatDialog.vue';
// import {
//   getNormalContent,
//   getReasoningContent,
//   createMessage,
// } from '@/common/utils/util';
// 状态管理
const store = useStore();
// const chatPanelRef = ref<InstanceType<typeof ChatPanel> | null>(null);
// 状态
const loading = ref(false);
const currentChatIndex = ref(0);
const currentEditChatIndex = ref(0);
const currentChat = computed(() => {
  // console.log('current chat', store.state.chatList[currentChatIndex.value]?.id);
  // return store.state.chatList && store.state.chatList[currentChatIndex.value];
  return {};
});
const currentEditChat = computed(() => {
  // return store.state.chatList && store.state.chatList[currentEditChatIndex.value];
  return {}
});
const currentMessages = computed(() => {
  // if (!currentChat.value) {
  //   return [];
  // }
  // const messages = store.state.messages[currentChat.value.id];
  // if (!messages) {
  //   store.dispatch('fetchMessages', { chatId: currentChat.value.id });
  // }
  // return store.state.messages[currentChat.value.id] || [];
  return []
});

const chatList = []; //computed(() => store.state.chatList);

const showSidebar = ref(true);

const currentMenu = ref({key: 'settings', label: '设置'});

// // 添加编辑对话相关的状态
const editModalVisible = ref(false);

// // 新增以下代码
const mainBoardRef = ref<HTMLElement | null>(null);
const mainBoardHeight = ref(0);

// // 计算容器高度
const updateMainBoardHeight = () => {
  if (mainBoardRef.value) {
    mainBoardHeight.value = mainBoardRef.value.clientHeight
  }
};

onMounted(() => {
  updateMainBoardHeight()
  window.addEventListener('resize', updateMainBoardHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMainBoardHeight);
});

const handleCopyChat = async (index: number) => {
  console.log('copy chat', index);

  // await store.dispatch('copyChat', index);
};

const handleDeleteChat = async (index: number) => {
  console.log('delete chat', index);

  // await store.dispatch('deleteChat', index);
};

const handleFavoriteChat = async (index: number) => {
  console.log('favorite chat', index);

  // await store.dispatch('favoriteChat', index);
};

// 方法
const handleNewChat = async () => {
  // try {
  //   loading.value = true;
  //   await store.dispatch('insertChat');
  //   currentChatIndex.value = 0;
  // } catch (error) {
  //   console.error('Failed to create new chat:', error);
  // } finally {
  //   loading.value = false;
  // }
};

const handleSelectChat = async (index: number) => {
  // try {
  //   currentMenu.value = { key: 'chat', label: '新对话' };
  //   loading.value = true;
  //   currentChatIndex.value = index;
  //   await store.dispatch('selectChat', index);
  // } catch (error) {
  //   console.error('Failed to load chat:', error);
  // } finally {
  //   loading.value = false;
  // }
};

const handleSelectMenu = async (obj: {key, label}) => {
  currentMenu.value = obj;
  // if (obj.key === 'chat') {
    // await store.dispatch('insertChat');
    // currentChatIndex.value = 0;
  // }
};

// const handleSendMessage = async (inputMessage: string) => {
//   if (!currentChat.value) return;
//   // const chatService: INextChatService = new OpenAIChatService(useChatContext());
//   const chatService: INextChatService = createService(currentChat.value.provider, useChatContext());
//   const prompt = inputMessage.trim();
//   if (prompt.trim() === '') {
//     return;
//   }
//   const provider = currentChat.value.provider;
//   const model = currentChat.value.model;
//   const $chatId = currentChat.value.id;
//   const actualPrompt = prompt;
//   const userMessage = createMessage($chatId, 'user', actualPrompt, provider, model);
//   await store.dispatch('insertMessage', userMessage);

//   const assistantMessage = createMessage($chatId, 'assistant', '', provider, model);
//   assistantMessage.generating = 1;
//   assistantMessage.parentId = userMessage.id;
//   await store.dispatch('insertMessage', assistantMessage);

//   const onChatComplete = async (result: IChatResponseMessage) => {
//     /**
//      * 异常分两种情况，一种是有输出， 但没有正常结束； 一种是没有输出
//      * 异常且没有输出，则只更新 isActive 为 0
//      */
//     if (result.error && isBlank(result.content) && isBlank(result.reasoning)) {
//       await store.dispatch('updateMessage', {
//         id: assistantMessage.id,
//         generating: 0,
//       });
//       console.log(`response message is blank `);
//     } else {
//       console.log(`response message`, result);
//       assistantMessage.content = getNormalContent(result.content as string);
//       assistantMessage.reasoning = getReasoningContent(result.content as string, result.reasoning);
//       assistantMessage.generating = 0;
//       await store.dispatch('updateMessage', assistantMessage);
//       chatPanelRef.value?.scrollToBottom();
//     }
//   };
//   chatService.onComplete(onChatComplete);
//   chatService.onReading((content: string, reasoning?: string) => {
//     console.log('reading', content || '', reasoning || '');
//     currentMessages.value[currentMessages.value.length - 1].content += content || '';
//     currentMessages.value[currentMessages.value.length - 1].reasoning += reasoning || '';
//   });

//   chatService.onToolCalls((toolName: string) => {
//     // updateStates($chatId, { runningTool: toolName });
//     console.log('call tool', toolName);
//   });

//   chatService.onError((err: any, aborted: boolean) => {
//     console.error(err);
//   });

//   // actualPrompt = '在D://mcp-fs中创建一个hello.txt, 文件内容是 当前时间';
//   const chatMessages = currentMessages.value.map(message => {
//     return {
//       role: message.role,
//       content: message.content,
//     };
//   });
//   console.log('chat messages', chatMessages);
//   await chatService.chat(chatMessages);
// };

const handleToggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const handleEditChat = (index) => {

}

// const handleEditChat = (index) => {
//   if (index != null) {
//     currentEditChatIndex.value = index;
//   } else {
//     currentEditChatIndex.value = currentChatIndex.value;
//   }
//   editModalVisible.value = true;
// };

// const handleEditSave = async (formData) => {
//   try {
//     loading.value = true;
//     await store.dispatch('updateChat', formData);
//   } catch (error) {
//     console.error('Failed to update chat:', error);
//   } finally {
//     loading.value = false;
//   }
// };

// const handleCancelEdit = () => {
//   editModalVisible.value = false;
// };

const handleSearch = (value: string) => {
  // TODO: 实现搜索消息的逻辑
};

const handleHistory = () => {
  // TODO: 实现显示历史话题的逻辑
};

const handleMenuAction = async (key: string) => {
  switch (key) {
    case 'export':
      // TODO: 实现导出聊天记录的逻辑
      break;
    case 'clear':
      // await store.dispatch('clearChat', currentChatIndex.value);
      break;
    case 'delete':
      // await store.dispatch('deleteChat', currentChatIndex.value);
      break;
  }
};

// 生命周期
onMounted(async () => {
  // 加载最近的聊天
  // const recentChat = await store.dispatch('loadRecentChat');
  // if (recentChat) {
  //   currentChat.value = recentChat;
  // }
});
// const init = () => store.dispatch('init');
// init();
</script>
<style lang="less" scoped>
.chat-container {
  height: 100%;
  display: flex;
  background: var(--color-bg);
  gap: 0;
}

:deep(.ant-modal-content) {
  background: var(--color-body-bg);
}

:deep(.ant-modal-header) {
  background: var(--color-body-bg);
  border-bottom: 1px solid var(--color-border-light);
}

:deep(.ant-modal-title) {
  color: var(--color-text-primary);
}

:deep(.ant-form-item-label > label) {
  color: var(--color-text-content);
}

:deep(.ant-input), 
:deep(.ant-select-selector),
:deep(.ant-input-number) {
  background: var(--color-input-bg) !important;
  border-color: var(--color-border-light) !important;
  color: var(--color-text-content) !important;
}

:deep(.ant-slider-rail) {
  background-color: var(--color-border-light);
}

:deep(.ant-slider-track) {
  background-color: var(--ant-primary-color);
}

:deep(.ant-slider-handle) {
  border-color: var(--ant-primary-color);
}

:deep(.ant-collapse) {
  background: transparent;
  border: none;
}

:deep(.ant-collapse-header) {
  color: var(--color-text-primary) !important;
}

:deep(.ant-collapse-content) {
  background: transparent;
  border-top: 1px solid var(--color-border-light);
}

:deep(.ant-collapse-item) {
  border-bottom: none !important;
}

.icon-upload {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin: 20px auto;
  border: 1px dashed var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    border-color: var(--ant-primary-color);
  }

  .chat-icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
