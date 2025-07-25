<template>
  <div class="sidebar">
    <!-- 标题栏 -->
    <div class="sidebar-header">
      <h1 class="title">{{ props.title }}</h1>
      <a-button class="icon-btn" type="text">
        <MenuFoldOutlined 
          style="font-size: 18px; cursor: pointer" 
          @click.stop="handleToggleSidebar" 
        />
      </a-button>
    </div>

    <!-- 对话列表 -->
    <div class="chat-list">
      <div
        v-for="(chat, index) in props.chatList"
        :key="chat.id"
        class="chat-item"
        :class="{ active: chat.active }"
        @click="handleSelectChat(index)"
      >
        {{ chat.name }}
        <a-button
          class="icon-btn"
          type="text"
          v-if="!chat.isFavorite"
          @click.stop="handleContextMenu($event, index)"
        >
          <EllipsisOutlined />
        </a-button>
        <a-button
          class="icon-btn"
          type="text"
          v-if="chat.isFavorite"
          @click.stop="handleContextMenu($event, index)"
        >
          <StarOutlined />
        </a-button>
      </div>
    </div>

    <!-- 上下文菜单 -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ top: contextMenuPosition.top, right: contextMenuPosition.right }"
    >
      <a-button type="text" @click="handleEditChat">
        <EditOutlined class="menu-icon" />
        <span class="menu-text">编辑</span>
      </a-button>
      <a-button type="text" @click="handleCopyChat">
        <CopyOutlined class="menu-icon" />
        <span class="menu-text">复制</span>
      </a-button>
      <a-button type="text" @click="handleFavoriteChat">
        <StarOutlined class="menu-icon" />
        <span class="menu-text" v-if="!isFavorite">收藏</span>
        <span class="menu-text" v-else>取消收藏</span>
      </a-button>
      <a-button type="text" @click="handleDeleteChat" class="delete-button">
        <DeleteOutlined class="menu-icon" />
        <span class="menu-text">删除</span>
      </a-button>
    </div>

    <!-- 垂直菜单列表 -->
    <div class="menu-list">
      <div
        v-for="item in menuItems"
        :key="item.key"
        class="menu-item"
        @click="handleMenuClick(item.key, item.label)"
      >
        <component :is="item.icon" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  MenuFoldOutlined,
  MessageOutlined,
  ToolOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  EllipsisOutlined,
  EditOutlined,
  CopyOutlined,
  StarOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';

import {
  IChat,
} from '../../intellichat/types';

const { t } = useI18n();


const props = defineProps({
  title: {
    type: String,
    default: 'Qiko Now',
  },
  chatList: {
    type: Array as () => Array<IChat>,
    default: () => [],
  },
});

// 事件
const emit = defineEmits<{
  (e: 'new-chat'): void;
  (e: 'select-chat', index: number): void;
  (e: 'copy-chat', index: number): void;
  (e: 'favorite-chat', index: number): void;
  (e: 'delete-chat', index: number): void;
  (e: 'toggle-sidebar'): void;
  (e: 'select-menu', menu: { key; label }): void;
  (e: 'edit-chat', chatIndex: number): void;
}>();

// 状态
const showContextMenu = ref(false);
const contextMenuPosition = ref({ top: '0px', right: '2px' });
const selectedChatIndex = ref<number | null>(null);
const isFavorite = ref(false);
// 菜单配置
const menuItems = [
  { key: 'chat', icon: MessageOutlined, label: '新对话' },
  { key: 'toolbox', icon: ToolOutlined, label: '工具箱' },
  { key: 'settings', icon: SettingOutlined, label: '设置' },
  { key: 'about', icon: InfoCircleOutlined, label: '关于' },
];

// 方法
const handleMenuClick = (key: string, label: string) => {
  emit('select-menu', { key, label });
};

const handleSelectChat = (index: number) => {
  emit('select-chat', index);
};

const handleToggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleContextMenu = (event: MouseEvent, index: number) => {
  event.stopPropagation();
  if (showContextMenu.value) {
    showContextMenu.value = false;
  } else {
    selectedChatIndex.value = index;
    showContextMenu.value = true;
    isFavorite.value = !!props.chatList[index].isFavorite;
    const target = event.currentTarget as HTMLElement;
    contextMenuPosition.value = {
      top: `${target.getBoundingClientRect().bottom + 2}px`,
      right: '5px',
    };
  }
};

const handleEditChat = () => {
  if (selectedChatIndex.value !== null) {
    emit('edit-chat', selectedChatIndex.value);
  }
  showContextMenu.value = false;
};

const handleCopyChat = () => {
  console.log('Copy chat:', selectedChatIndex.value);
  if (selectedChatIndex.value !== null) {
    emit('copy-chat', selectedChatIndex.value);
  }
  showContextMenu.value = false;
};

const handleFavoriteChat = () => {
  console.log('Favorite chat:', selectedChatIndex.value);
  if (selectedChatIndex.value !== null) {
    emit('favorite-chat', selectedChatIndex.value);
  }
  showContextMenu.value = false;
};

const handleDeleteChat = () => {
  console.log('Delete chat:', selectedChatIndex.value);
  if (selectedChatIndex.value !== null) {
    emit('delete-chat', selectedChatIndex.value);
  }
  showContextMenu.value = false;
};

// 点击其他地方隐藏上下文菜单
const handleClickOutside = (event: MouseEvent) => {
  if (showContextMenu.value) {
    showContextMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

</script>

<style lang="less" scoped>
.sidebar {
  width: 240px;
  height: 100%;
  border-right: 1px solid var(--color-border-light);
  background: var(--color-bg-sidebar);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;

  .sidebar-header {
    height: 44px;
    padding: 10px 20px;
    // border-bottom: 1px solid var(--color-border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
      padding-left: 12px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: var(--color-hover);
      }
    }
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;

    .chat-item {
      padding: 10px;
      margin: 5px 0;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background: var(--color-hover);
      }

      &.active {
        background: var(--color-active);
      }

      .icon-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: var(--color-border-light);
        }
      }
    }
  }

  .context-menu {
    position: absolute;
    background: var(--color-context-menu-light);
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    padding: 4px;
    display: flex;
    flex-direction: column;
    width: 120px;

    :deep(.ant-btn) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 4px 12px;
      margin: 0;
      text-align: left;

      &:hover {
        background: var(--color-hover);
      }

      &.delete-button {
        border-top: 1px solid var(--color-border-light);
      }

      .menu-icon {
        margin-right: 8px;
        flex-shrink: 0;
      }

      .menu-text {
        font-size: 14px;
        color: var(--color-text);
      }
    }
  }

  .menu-list {
    width: 100%;
    padding: 0;
    border-top: 1px solid var(--color-border-light);

    .menu-item {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      cursor: pointer;
      border-radius: 6px;
      margin: 4px 10px;
      width: calc(100% - 20px);

      &:hover {
        background: var(--color-hover-light);
      }

      &.active {
        background: var(--color-active-light);
      }

      .menu-icon {
        font-size: 16px;
        margin-right: 12px;
      }

      .menu-label {
        font-size: 14px;
        color: var(--color-text);
      }
    }
  }
}
</style>