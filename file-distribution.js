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

const environmentCases = {
  match: ['可以继续按照用户要求', '三类脚本与运行命令均已核对一致，继续处理用户需求；ODS 结构、Export 字段和下载配置仍需按清单核实。', false],
  copy: ['获取生产脚本，补齐测试缺失文件', '生产 → 测试：只写入测试环境已确认缺失的脚本文件。补齐后重新读取比较，并核实运行命令；未复核通过前不直接继续。', false],
  'test-only': ['生产缺少脚本，后续待讨论', '列出对应任务和生产环境缺失文件，不自动向生产补齐；说明现状并暂停后续处理。', true],
  different: ['提示差异，暂停并待讨论', '逐项展示脚本内容或运行命令的差异，包含 Export 字段数量及顺序；不自动覆盖已有文件、不静默改写命令。', true],
  missing: ['两边均缺少脚本，处理策略待讨论', '没有可用于补齐测试的生产脚本。列出缺项，不自动生成脚本，也不将缺失状态当作核对通过。', true],
  unknown: ['比较证据不完整，无法判断', '先补充脚本和实际运行命令的查询结果。接口失败不能当作文件缺失，也不能据此判断两个环境一致。', true]
};
const environmentSelect = document.getElementById('environment-case');
environmentSelect.addEventListener('change', () => {
  const [title, description, pending] = environmentCases[environmentSelect.value];
  document.getElementById('decision-title').textContent = title;
  document.getElementById('decision-description').textContent = description;
  document.querySelector('.decision-result').classList.toggle('pending', pending);
});
