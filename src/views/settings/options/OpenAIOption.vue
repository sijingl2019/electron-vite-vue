<template>
  <div class="openai-options">
    <a-form layout="vertical">
      <a-form-item label="API Key" v-if="!keepBone">
        <a-input-password
          v-model:value="settings.key"
          placeholder="请输入 OpenAI API Key"
        />
      </a-form-item>
      <a-form-item label="API Base URL" v-if="!keepBone">
        <a-input
          v-model:value="settings.base"
          placeholder="请输入 API Base URL（可选）"
        />
      </a-form-item>
      <a-form-item label="默认模型">
        <a-select
          v-model:value="settings.model"
          :options="modelOptions"
          placeholder="请选择默认模型"
        />
      </a-form-item>

      <!-- 高级配置折叠面板 -->
      <a-collapse>
        <a-collapse-panel key="1" header="高级配置">
          <a-form-item label="上下文消息数量上限">
            <a-slider
              v-model:value="settings.maxCtxMessages"
              :marks="marks"
              :min="1"
              :max="21"
              :tip-formatter="formatter">
              <template #mark="{ label, point }">
                <template v-if="point === 21">
                  <strong>{{ label }}</strong>
                </template>
                <template v-else>{{ label }}</template>
              </template>
            </a-slider>
          </a-form-item>
          <a-form-item label="Temperature">
            <a-slider
              v-model:value="settings.temperature"
              :min="0"
              :max="2"
              :step="0.1"
              :tooltip-visible="true"
            />
          </a-form-item>

          <a-form-item label="Top P">
            <a-slider
              v-model:value="settings.topP"
              :min="0"
              :max="1"
              :step="0.1"
              :tooltip-visible="true"
            />
          </a-form-item>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, watch, toRaw, defineProps, defineEmits } from 'vue';
import { providers } from '../../../providers/index';
const emit = defineEmits<{
  (e: 'update', config): void;
}>();
const props = defineProps<{
  keepBone: boolean;
  initialData: {
    key?: string;
    base?: string;
    model: string;
    maxCtxMessages: number;
    temperature: number;
    topP: number;
  };
}>();

console.log('OpenAIOption props:', props);
console.log('OpenAIOption initialData:', props.initialData);

const settings = reactive({
  key: props.initialData?.key || '',
  base: props.initialData?.base || 'https://api.openai.com/v1',
  model: props.initialData?.model || 'gpt-4o',
  maxCtxMessages: props.initialData?.maxCtxMessages || 10000,
  temperature: props.initialData?.temperature || 1,
  topP: props.initialData?.topP || 1,
});

// const apiKey = ref('')
// const baseUrl = ref('')
// const defaultModel = ref('')

// // 高级配置选项
// const maxContextMessages = ref(20)
// const temperature = ref(1)
// const topP = ref(1)

const modelOptions = Object.keys(toRaw(providers.OpenAI.chat.models)).map(key => ({
    label: key,
    value: key,
  })
);
const formatter = (value: number) => {
  return value === 21 ? '不限制' : `${value}`;
};
const updateConfig = () => {
  emit('update', toRaw(settings));
};

watch(settings, updateConfig);

const marks = ref<Record<number, any>>({
  21: {
    style: {
      color: '#f50',
    },
    label: '不限制',
  },
});
</script>

<style scoped>
.openai-options :deep(.ant-collapse) {
  margin-top: 16px;
  background-color: transparent;
}

.openai-options :deep(.ant-collapse-header) {
  color: rgba(0, 0, 0, 0.85);
}
</style> 