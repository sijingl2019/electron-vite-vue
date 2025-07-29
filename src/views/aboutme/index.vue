<template>
  <div class="about-me">
    <div class="view-container">
      <div v-if="content !== 'error'" v-html="content" class="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
const content = ref('');

const { t } = useI18n();

const markdown = new MarkdownIt();
onMounted(async () => {
  try {
    const mdContent = '1234';//await window.qikodb.readAboutMe();
    content.value = markdown.render(mdContent);
  } catch (e) {
    content.value = '加载失败';
  }
});
</script>

<style lang="less">
@import '../../assets/var.less';

.about-me {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-body-bg2);
  height: calc(~'100vh - 44px');
  position: relative;

  .view-container {
    border-radius: 8px;
    background: var(--color-body-bg);
    overflow: auto;
    height: calc(~'100vh - 84px');
    padding: 20px;
  }

  .content {
    color: var(--color-text-content);
    line-height: 1.6;

    h2 {
      color: var(--color-text-primary);
      font-size: 24px;
      margin-bottom: 16px;
    }

    h3 {
      color: var(--color-text-primary);
      font-size: 18px;
      margin-bottom: 12px;
    }
  }
}
</style>
