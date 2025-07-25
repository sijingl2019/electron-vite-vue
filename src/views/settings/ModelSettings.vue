<template>
  <div class="model-settings">
    <!-- 模型提供方选择 -->
    <a-select
      v-model:value="currentProvider"
      class="provider-select"
      :options="providerOptions"
      placeholder="请选择模型提供方"
    />

    <!-- 分割线 -->
    <a-divider />

    <!-- 动态加载对应的配置组件 -->
    <OpenAIOption v-if="currentProvider === 'OpenAI'" :initialData="currentConfig" @update="setConfig"/>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue';
import { useStore } from 'vuex';
import { providers } from '../../providers/index';
import OpenAIOption from './options/OpenAIOption.vue';
import localConfig from '../../confOp';
import debounce from 'lodash.debounce';

const store = useStore();
const currentProvider = ref('OpenAI');
const currentConfig = ref({})

// 获取所有提供方并转换为选择器选项格式
const providerOptions = Object.keys(toRaw(providers)).map(provider => ({
  label: provider,
  value: provider,
}));
const { modelSettings, llm } = localConfig.getConfig() || {};
console.log('model settings', modelSettings);
currentProvider.value = llm.defaultProvider;
currentConfig.value = modelSettings[llm.defaultProvider];

const setConfig = async (config) => {
  // debounce(() => {
  const savedConfig = localConfig.getConfig();

  localConfig.setConfig(
    JSON.parse(
      JSON.stringify({
        llm: {
          ...llm,
          defaultProvider: currentProvider.value,
        },
        modelSettings: {
          ...savedConfig.modelSettings,
          [currentProvider.value]: config,
        },
      })
    )
  );
  Object.assign(currentConfig.value, config)
  await store.dispatch('updateModelSettings', {
    modelSettings: {
      ...savedConfig.modelSettings,
      [currentProvider.value]: config,
    },
  });
  // }, 500);
};
</script>

<style scoped>
.model-settings {
  padding: 20px;
}

.provider-select {
  width: 100%;
  margin-bottom: 16px;
}
</style>
