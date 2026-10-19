'use strict';
const collectionModes = {
  full: { badge: '全表快照', title: '采集源表的全部数据', description: 'STG 获取源表所有行，覆盖写入 STG 表；ODS 将 STG 全量数据写入今日分区。', stg: '源表全部数据 → 覆盖 STG', condition: '取数范围：源表所有行' },
  incremental: { badge: '指定日期数据', title: '仅采集源表指定日期的数据', description: '例如行情表只读取交易日期等于本次采集日期的数据，覆盖写入 STG；ODS 仍将 STG 全量数据写入今日分区。', stg: '源表日期筛选结果 → 覆盖 STG', condition: '示例条件：交易日期 = 本次采集日期' }
};
const collectionTabs = [...document.querySelectorAll('[data-mode]')];
function setCollectionMode(tab) {
  collectionTabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  document.getElementById('collection-panel').setAttribute('aria-labelledby', tab.id);
  const mode = collectionModes[tab.dataset.mode];
  for (const [id, text] of Object.entries({ 'collection-badge': mode.badge, 'collection-title': mode.title, 'collection-description': mode.description, 'stg-rule': mode.stg, 'source-condition': mode.condition })) document.getElementById(id).textContent = text;
}
collectionTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setCollectionMode(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = collectionTabs[(index + 1) % collectionTabs.length];
    if (event.key === 'ArrowLeft') next = collectionTabs[(index - 1 + collectionTabs.length) % collectionTabs.length];
    if (event.key === 'Home') next = collectionTabs[0];
    if (event.key === 'End') next = collectionTabs[collectionTabs.length - 1];
    if (next) { event.preventDefault(); setCollectionMode(next); next.focus(); }
  });
});
