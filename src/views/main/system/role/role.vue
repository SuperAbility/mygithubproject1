<template>
  <div class="role">
    <page-search :searchFormConfig="searchFormConfig" />
    <pageWholeContent
      :TableContentConfig="TableContentConfig"
      systemDataName="roleList"
    >
    </pageWholeContent>
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { searchFormConfig } from './config/search.config'
import PageSearch from '@/components/page-search'
import { TableContentConfig } from './config/content.config'
import pageWholeContent from '@/components/page-tablewholecontent'

export default defineComponent({
  name: 'user',
  components: { PageSearch, pageWholeContent },
  setup() {
    const selectionChangeToParent = (value: any) => {
      console.log('父组件里面的value勾选值', value)
    }
    return {
      searchFormConfig,
      selectionChangeToParent,
      TableContentConfig
    }
  }
})
</script>

<style scoped>
.el-form-item__label-wrap {
  margin-left: 0 !important;
}
</style>
