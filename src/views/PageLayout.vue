<template>
  <div class="page-layout">
    <div class="header">
      <a-button
        v-if="!showSidebar"
        class="icon-btn"
        type="text"
      >
        <MenuUnfoldOutlined style="font-size: 18px; cursor: pointer" @click.stop="handleToggleSidebar" />
      </a-button>
      <div class="title-section">
        <h2 class="title">{{ title }}</h2>
        <EditOutlined
          v-if="isChat"
          class="edit-icon"
          @click="handleEditChat"
        />
      </div>
      <div v-if="isChat" class="header-actions">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索消息内容..."
          style="width: 200px"
          @search="handleSearch"
        />
        <a-button class="icon-btn" type="text">
          <HistoryOutlined @click="handleHistory" />
        </a-button>
        <a-dropdown 
          :trigger="['click']"
          placement="bottomRight"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
        >
          <a-button class="icon-btn" type="text">
            <EllipsisOutlined />
          </a-button>
          <template #overlay>
            <a-menu class="action-menu">
              <a-menu-item key="export" @click="handleMenuClick('export')">
                <template #icon><ExportOutlined /></template>
                导出聊天记录
              </a-menu-item>
              <a-menu-item key="clear" @click="handleMenuClick('clear')">
                <template #icon><ClearOutlined /></template>
                清空聊天记录
              </a-menu-item>
              <a-menu-item key="delete" @click="handleMenuClick('delete')">
                <template #icon><DeleteOutlined /></template>
                删除当前会话
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { 
  MenuUnfoldOutlined,
  EditOutlined,
  HistoryOutlined,
  EllipsisOutlined,
  ExportOutlined,
  ClearOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  showSidebar: {
    type: Boolean,
    default: true,
  },
  isChat: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits([
  'toggle-sidebar',
  'edit-chat',
  'search',
  'history',
  'menu-click',
]);

const searchText = ref('');

const handleToggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleEditChat = () => {
  emit('edit-chat');
};

const handleSearch = (value: string) => {
  emit('search', value);
};

const handleHistory = () => {
  emit('history');
};

const handleMenuClick = (key: string) => {
  emit('menu-click', key);
};
</script>

<style lang="less" scoped>
@import '../assets/var.less';

.page-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-body-bg2);

  .header {
    height: 44px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-light);
    background: var(--color-body-bg);

    .icon-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: transparent;
      border: none;
      padding: 0;
      margin-right: 16px;

      &:hover {
        background: var(--color-hover);
      }

      .anticon {
        font-size: 18px;
        color: var(--color-text);
      }
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 8px;

      .edit-icon {
        font-size: 16px;
        color: var(--color-text);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;

        &:hover {
          background: var(--color-hover);
        }
      }
    }

    .header-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;

      .icon-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        .anticon {
          font-size: 16px;
          color: var(--color-text);
        }

        &:hover {
          background: var(--color-hover);
        }
      }
    }
  }

  .content {
    flex: 1;
    overflow: auto;
    padding: 0px;
  }
}

:deep(.action-menu) {
  margin-top: 0;
  margin-right: 20px;
  min-width: 160px;
  background: var(--color-context-menu-light);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .ant-menu-item {
    display: flex;
    align-items: center;
    padding: 4px 12px;
    margin: 0;
    height: auto;
    line-height: 1.5;

    .anticon {
      margin-right: 8px;
    }

    &:hover {
      background: var(--color-hover);
    }
  }
}
</style> 