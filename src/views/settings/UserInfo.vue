<template>
  <div class="user-info">
    <div class="settings-container">
      <!-- <div class="setting-item">
        <div class="title">
          {{ $t('feature.settings.account.themeColor') }}
        </div>
        <div class="settings-item-li">
          <a-radio-group @change="changeTheme" v-model:value="theme" button-style="solid">
            <a-radio-button value="SPRING">{{ $t('feature.settings.account.spring') }}</a-radio-button>
            <a-radio-button value="SUMMER">{{ $t('feature.settings.account.summer') }}</a-radio-button>
            <a-radio-button value="AUTUMN">{{ $t('feature.settings.account.autumn') }}</a-radio-button>
            <a-radio-button value="WINTER">{{ $t('feature.settings.account.winter') }}</a-radio-button>
          </a-radio-group>
        </div>
      </div> -->
      <div class="setting-item">
        <!-- <div class="title">
          {{ $t('feature.settings.account.personalized') }}
        </div> -->
        <div class="settings-item-li">
          <div class="label">
            {{ $t('feature.settings.account.greeting') }}
          </div>
          <a-input v-model:value="custom.placeholder" class="value"></a-input>
        </div>
        <div class="settings-item-li">
          <div class="label">
            {{ $t('feature.settings.account.name') }}
          </div>
          <a-input v-model:value="custom.username" class="value"></a-input>
        </div>
        <div class="settings-item-li">
          <div class="label">
            {{ $t('feature.settings.account.logo') }}
          </div>
          <div class="img-container">
            <img class="custom-img" :src="custom.logo" />
            <a-button class="btn" @click="changeLogo" shape="round" size="small" type="primary">
              {{ $t('feature.settings.account.replace') }}
            </a-button>
          </div>
        </div>
        <div class="settings-item-li">
          <div class="label">
            {{ $t('feature.settings.account.status') }}
          </div>
          <div class="img-container">
            <a-button class="btn" @click="showQikoWindowDetach" shape="round" size="small" type="primary">
              {{ $t('feature.settings.account.home') }}
            </a-button>
            <!-- <a-button class="btn" @click="logout" shape="round" size="small" type="primary" v-if="loginState.accessToken && loginState.accessToken.length">
              {{ $t('feature.settings.account.logout') }}
            </a-button>
            <a-button class="btn" @click="login" shape="round" size="small" type="primary" v-else>
              {{ $t('feature.settings.account.login') }}
            </a-button> -->
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch, ref } from 'vue';
import debounce from 'lodash.debounce';
import localConfig from '../../confOp';
import * as Themes from '../../assets/constans';
// const { ipcRenderer } = window.require('electron');

const state = reactive({
  custom: {},
});

const loginState = reactive({
  accessToken: '',
});

const { perf, loginInfo } = localConfig.getConfig();

const theme = ref(perf.custom.theme);

console.log('access token', loginInfo.accessToken);
state.custom = {
  ...(perf.custom || {}),
};

loginState.accessToken = loginInfo.accessToken;

const setConfig = debounce(() => {
  const { perf } = localConfig.getConfig();

  localConfig.setConfig(
    JSON.parse(
      JSON.stringify({
        perf: {
          ...perf,
          custom: state.custom,
        },
      })
    )
  );
  // ipcRenderer.send('re-register');
}, 500);

watch(state, setConfig);
const { custom } = toRefs(state);

const changeLogo = () => {
  const [logoPath] = window.qiko.showOpenDialog({
    title: '请选择 logo 路径',
    filters: [{ name: 'images', extensions: ['png'] }],
    properties: ['openFile'],
  });
  state.custom.logo = `file://${logoPath}`;
};

const changeTheme = () => {
  state.custom = {
    ...state.custom,
    ...Themes[theme.value],
  };
};

const showQikoWindowDetach = async () => {
  await window.qiko.showQikoWindowDetach();
};

// const reset = () => {
//   Modal.warning({
//     title: '确定恢复默认设置吗？',
//     content: '回复后之前的设置将会被清空',
//     onOk() {
//       const defaultcustom = remote.getGlobal('OP_CONFIG').getDefaultConfig()
//         .perf.custom;
//       state.custom = JSON.parse(JSON.stringify(defaultcustom));
//     },
//   });
// };
</script>

<style lang="less">
.ant-radio-button-wrapper {
  background: var(--color-body-bg);
  color: var(--color-text-content);
}
.user-info-result {
  padding: 0;
  .theme-preview {
    width: 20px;
    height: 20px;
    border-radius: 100%;
  }
  &.ant-result {
    padding: 24px;
  }
  .icon {
    font-size: 48px;
  }
  .ant-result-icon {
    margin-bottom: 12px;
  }
  .ant-result-title {
    font-size: 18px;
  }
}
.img-container {
  width: 300px;
  .btn {
    margin-left: 10px;
    font-size: 12px;
  }
}
.custom-img {
  width: 60px;
  height: 60px;
}
.footer-btn {
  text-align: right;
  border-top: 1px dashed #ddd;
  padding-top: 12px;
}
</style>
