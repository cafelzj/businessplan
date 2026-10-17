'use strict';

// This is a planning prototype. All task records and time transitions are illustrative.
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (next) { event.preventDefault(); activateTab(next); next.focus(); }
  });
});

const phases = [
  ['运行中', '新建 Session，读取 BI 数据并调用 Skill 开始分析。', '等待文件', '交付物尚未就绪，推送计划为 10:00。'],
  ['已完成', '分析结束，文件交付物已生成并可获取。', '等待推送', '距计划推送尚有 7 小时，不在生成完成时立即发送。'],
  ['已完成', '使用 03:00 已生成的交付物，无需再次运行分析。', '已推送（示意）', '示例中，文件已就绪且授权通过，10:00 推送给配置的用户。']
];
document.querySelectorAll('[data-phase]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-phase]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    const values = phases[Number(button.dataset.phase)];
    ['run-phase', 'run-description', 'delivery-phase', 'delivery-description'].forEach((id, i) => {
      document.getElementById(id).textContent = values[i];
    });
  });
});

const sessions = [
  { id: 'demo-session-001', agent: '经营分析 Agent', task: '每日经营分析', skills: '取数分析 / 图表生成 Skill', state: 'done', label: '已完成', batch: 'demo-batch-001', start: '02:00', end: '03:00', plan: '10:00 · 示例用户组 A', delivery: '等待推送', deliveryClass: 'waiting', artifacts: [ { name: '每日经营分析.html', format: 'HTML', note: '分析说明与图表' }, { name: '经营明细.xlsx', format: 'XLSX', note: '分析明细数据' } ], detail: 'Session 已完成，2 份交付物已就绪。等待计划推送时刻，不会因 03:00 运行结束而立即发送。' },
  { id: 'demo-session-002', agent: '归因分析 Agent', task: '指标变化归因', skills: '归因分析 Skill', state: 'error', label: '异常', batch: 'demo-batch-002', start: '02:00', end: '02:18', plan: '10:00 · 示例用户组 B', delivery: '阻塞 · 无交付物', deliveryClass: 'error', artifacts: [], detail: '示例异常：取数接口超时。本次未生成交付物，推送被阻塞。建议管理员查看错误阶段与日志，按重试策略新增关联 Session；不得将上一次文件当作本次结果。' },
  { id: 'demo-session-003', agent: '报表分析 Agent', task: '分析报表汇总', skills: '报表分析 / 文档生成 Skill', state: 'running', label: '运行中', batch: 'demo-batch-003', start: '02:30', end: '尚未结束', plan: '10:00 · 示例用户组 C', delivery: '等待文件', deliveryClass: 'waiting', artifacts: [], detail: '示例当前阶段：图表与报告生成中。持续观察 Session 状态；只有确认成功并获取完整交付物后，才能进入待推送状态。' }
];
const dialog = document.getElementById('session-dialog');
function showSession(session) {
  document.getElementById('session-dialog-title').textContent = session.task;
  const detail = document.getElementById('session-detail');
  detail.replaceChildren();
  const fields = [ ['Agent', session.agent], ['Session', session.id], ['执行批次', session.batch], ['执行状态', session.label], ['开始 / 结束', `${session.start} / ${session.end}`], ['推送计划', session.plan] ];
  const grid = document.createElement('div'); grid.className = 'detail-grid';
  fields.forEach(([label, value]) => {
    const field = document.createElement('div');
    const key = document.createElement('small'); key.textContent = label;
    const text = document.createElement('strong'); text.textContent = value;
    field.append(key, text); grid.append(field);
  });
  detail.append(grid);
  const heading = document.createElement('h3'); heading.textContent = '绑定 Skill（示例）';
  const skills = document.createElement('p'); skills.textContent = session.skills;
  const outputHeading = document.createElement('h3'); outputHeading.textContent = `关联 Artifact · ${session.artifacts.length} 份`;
  detail.append(heading, skills, outputHeading);
  if (!session.artifacts.length) {
    const empty = document.createElement('p'); empty.textContent = '本次 Session 当前没有可获取的文件。'; detail.append(empty);
  }
  session.artifacts.forEach(artifact => {
    const item = document.createElement('div'); item.className = 'artifact-item';
    const name = document.createElement('strong'); name.textContent = artifact.name;
    const note = document.createElement('small'); note.textContent = `${artifact.format} · ${artifact.note} · 原型文件，不提供实际下载`;
    item.append(name, note); detail.append(item);
  });
  const description = document.createElement('p'); description.textContent = session.detail;
  detail.append(description); dialog.showModal();
}
function renderSessions(filter = 'all') {
  const body = document.getElementById('session-rows'); body.replaceChildren();
  for (const session of sessions.filter(item => filter === 'all' || item.state === filter)) {
    const row = document.createElement('tr');
    // All values below come from the static demonstration records above.
    row.innerHTML = `<td><strong>${session.agent}</strong><small>${session.task}</small></td><td>${session.id}</td><td><span class="status ${session.state}">${session.label}</span></td><td>${session.artifacts.length ? `${session.artifacts.length} 份 · HTML / XLSX` : '—'}</td><td>${session.plan}</td><td><span class="status ${session.deliveryClass}">${session.delivery}</span></td><td><button class="table-detail" aria-label="查看${session.task}详情">详情 ↗</button></td>`;
    row.querySelector('button').addEventListener('click', () => showSession(session));
    body.append(row);
  }
}
document.getElementById('session-filter').addEventListener('change', event => renderSessions(event.target.value));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
renderSessions();
