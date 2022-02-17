/* 所有页面page-seacrh组件里面全局逻辑代码抽取 */

import { ref } from 'vue'
import pageWholeContent from '@/components/page-tablewholecontent'
export function AllPageSearch() {
  const pageContentRef = ref<InstanceType<typeof pageWholeContent>>()

  const handleResetClick = () => {
    //这个里面用可选链，因为pageContentRef.value这个可能没有值
    pageContentRef.value?.getPageData()
  }
  const handleQueryClick = (queryInfo: any) => {
    pageContentRef.value?.getPageData(queryInfo)
  }
  //上面三个引用的数据需要在页面里面返回对吧
  //在页面返回的数据可以用return单独返回出去
  return [pageContentRef, handleResetClick, handleQueryClick]
}
