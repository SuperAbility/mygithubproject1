export const TableContentConfig = {
  title: '角色列表',
  propList: [
    { prop: 'name', label: '角色名', 'min-width': 100 },
    { prop: 'intro', label: '角色权限', 'min-width': 100 },
    {
      prop: 'creatAt',
      label: '创建时间',
      'min-width': 200,
      slotName: 'creatAt'
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      'min-width': 200,
      slotName: 'updateAt'
    },
    { label: '操作', minWidth: '120', slotName: 'operation' }
  ],
  showIndexColumn: true,
  showSelectColumn: true
}
