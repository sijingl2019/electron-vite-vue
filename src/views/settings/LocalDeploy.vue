<template>
  <a-alert
    :message="$t('feature.settings.intranet.tips')"
    type="warning"
    style="margin-bottom: 20px"
  />
  <a-form
    name="custom-validation"
    ref="formRef"
    :model="formState"
    :rules="rules"
    v-bind="layout"
  >
    <a-form-item
      has-feedback
      :label="$t('feature.settings.intranet.npmMirror')"
      name="register"
    >
      <a-input
        placeholder="https://registry.npm.taobao.org"
        v-model:value="formState.register"
      />
    </a-form-item>
    <a-form-item
      has-feedback
      :label="$t('feature.settings.intranet.dbUrl')"
      name="database"
    >
      <a-input
        placeholder="https://gitee.com/monkeyWang/rubickdatabase/raw/master"
        v-model:value="formState.database"
      />
    </a-form-item>
    <a-form-item
      has-feedback
      :label="$t('feature.settings.intranet.qikoServer')"
      name="qiko_server"
    >
      <a-input
        :placeholder="$t('feature.settings.intranet.qikoServerPlaceholder')"
        v-model:value="formState.qiko_server"
      />
    </a-form-item>
    <a-form-item
      has-feedback
      :label="$t('feature.settings.intranet.deepseekId')"
      name="deepseek_id"
    >
      <a-input
        :placeholder="$t('feature.settings.intranet.deepseekIdPlaceholder')"
        v-model:value="formState.deepseek_id"
      />
    </a-form-item>
    <a-form-item
      has-feedback
      :label="$t('feature.settings.intranet.accessToken')"
      name="access_token"
    >
      <a-input
        :placeholder="$t('feature.settings.intranet.placeholder')"
        v-model:value="formState.access_token"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 18, offset: 6 }">
      <a-button @click="submit" type="primary">确定</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">恢复默认</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { ref, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import localConfig from '../../confOp';
import debounce from 'lodash.debounce';
const { localDeploy } = localConfig.getConfig();

let defaultConfig = {
  register: localDeploy.register || 'https://registry.npm.taobao.org',
  database: localDeploy.database || 'https://gitee.com/monkeyWang/rubickdatabase/raw/master',
  qiko_server: localDeploy.qiko_server || 'https://chat.qkos.cn',
  deepseek_id: localDeploy.deepseek_id || 'fde60fa3-9f54-4a30-a17c-9979fb6c406c',
  access_token: localDeploy.access_token || '',
};

const formState = ref(JSON.parse(JSON.stringify(defaultConfig)));

const rules = {
  register: [{ required: true, trigger: 'change' }],
  database: [{ required: true, trigger: 'change' }],
  qiko_server: [{ required: true, trigger: 'change' }],
  deepseek_id: [{ required: true, trigger: 'change' }],
};
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const resetForm = () => {
  formState.value = {
    register: localDeploy.register || 'https://registry.npm.taobao.org',
    database: localDeploy.database || 'https://gitee.com/monkeyWang/rubickdatabase/raw/master',
    qiko_server: localDeploy.qiko_server || 'https://chat.qkos.cn',
    deepseek_id: localDeploy.deepseek_id || 'fde60fa3-9f54-4a30-a17c-9979fb6c406c',
    access_token: localDeploy.access_token || '',
  };
};

const setConfig = debounce(() => {
  const { localDeploy } = localConfig.getConfig();

  localConfig.setConfig(
    JSON.parse(
      JSON.stringify({
        localDeploy: {
          ...localDeploy,
          ...formState.value,
        },
      })
    )
  );
  // ipcRenderer.send('re-register');
}, 500);

const submit = () => {
  setConfig();
  message.success('设置成功！重启插件市场并重新登录后生效！');
};
</script>

<style lang="less" scoped>
.ant-form {
  :deep(.ant-form-item) {
    label {
      color: var(--color-text-content);
    }
  }
}
:deep(.ant-input) {
  background: var(--color-input-hover);
  color: var(--color-text-content);
}
</style>
