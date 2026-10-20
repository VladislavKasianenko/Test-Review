// Автотест audit.js на заглушке Figma API: каждое правило должно сработать там, где ожидается.
// Запуск: node tests/mock-audit.mjs ds-review/scripts/audit.js
import fs from 'node:fs';
const src = fs.readFileSync(process.argv[2], 'utf8').replace("'__NODE_ID__'", "'1:1'");
let idc = 100;
const vars = { v1: { name: '🍏 surface/primary/default', variableCollectionId: 'c1' }, v2: { name: 'corner/28', variableCollectionId: 'c2' }, v3: { name: '🔴 surface/muted/default', variableCollectionId: 'c1' }, v4: { name: 'neutral/gray/800', variableCollectionId: 'c3' } };
const cols = { c1: { name: 'theme pack 1' }, c2: { name: 'radius' }, c3: { name: 'color' } };
const styles = { s1: { name: '🍏 Body/Large/Loose' }, s2: { name: '🔴 Body/Large/Accent' } };
const comps = {};
function node(type, name, props = {}, children) {
  const n = { id: props.id || `${idc++}:1`, type, name, visible: true, width: 360, height: 100, fills: [], strokes: [], effects: [], boundVariables: {}, cornerRadius: 0, ...props };
  if (children) { n.children = children; children.forEach(c => c.parent = n); }
  n.findAllWithCriteria = ({ types }) => { const out = []; const walk = x => { (x.children || []).forEach(c => { if (types.includes(c.type)) out.push(c); walk(c); }); }; walk(n); return out; };
  n.findAll = (fn) => { const out = []; const walk = x => { (x.children || []).forEach(c => { if (fn(c)) out.push(c); walk(c); }); }; walk(n); return out; };
  return n;
}
function comp(name, key, remote = true, setName) { const c = { name, key, remote, type: 'COMPONENT' }; if (setName) c.parent = { type: 'COMPONENT_SET', name: setName, key: key + 's' }; return c; }
function inst(mc, props = {}, children) { const n = node('INSTANCE', mc.parent ? mc.parent.name : mc.name, props, children); n.getMainComponentAsync = async () => mc; n.overrides = props.overrides || []; return n; }
const solid = (r, g, b, bound) => ({ type: 'SOLID', color: { r, g, b }, visible: true, ...(bound ? { boundVariables: { color: { id: bound } } } : {}) });
const txt = (chars, style = 's1') => node('TEXT', chars, { characters: chars, textStyleId: style, fills: [solid(0, 0, 0, 'v1')], width: 50, height: 20 });
// Экран
const btnBack = inst(comp('State=Default', 'kb', true, '🍏 Button / Base / Primary'), { width: 300, height: 48 }, [txt('Назад')]);
const illu = inst(comp('Base illustration / 112 / Error', 'ki'), { width: 112, height: 112 });
const empty = inst(comp('Type=Default', 'ke', true, '🍏 Empty State'), { width: 328, height: 300 }, [illu, btnBack]);
const sheetHeader = inst(comp('Type=1', 'kh', true, '🍏 Bottomsheet Header'), { width: 360, height: 60 });
const sheet = node('FRAME', 'bottomsheet', { layoutMode: 'VERTICAL', itemSpacing: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, fills: [solid(1, 1, 1)] }, [sheetHeader, txt('Пункт', 's2')]);
const sec1 = node('FRAME', 'sec1', { fills: [solid(1, 1, 1, 'v1')], cornerRadius: 28, topLeftRadius: 28, topRightRadius: 28, bottomLeftRadius: 28, bottomRightRadius: 28, boundVariables: { topLeftRadius: { id: 'v2' }, topRightRadius: { id: 'v2' }, bottomLeftRadius: { id: 'v2' }, bottomRightRadius: { id: 'v2' } }, layoutMode: 'VERTICAL', itemSpacing: 12, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }, [empty]);
const sec2 = node('FRAME', 'sec2', { fills: [solid(1, 1, 1, 'v3')], cornerRadius: 28, topLeftRadius: 28, topRightRadius: 28, bottomLeftRadius: 28, bottomRightRadius: 28, layoutMode: 'VERTICAL', itemSpacing: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }, [txt('Без стиля', '')]);
const vec1 = node('VECTOR', 'Star', { width: 10, height: 10, fills: [solid(1, 0.8, 0.6)] });
const vec2 = node('VECTOR', 'Vector', { width: 20, height: 20, fills: [solid(0.5, 0.5, 0.5, 'v4')] });
const iconHand = node('FRAME', 'скидки', { width: 48, height: 48, layoutMode: 'NONE' }, [vec1, vec2, txt('%')]);
const logo = node('FRAME', 'Base / 40 / Logo / Main / Colored', { width: 40, height: 40 }, [node('VECTOR', 'v', { width: 30, height: 10, fills: [solid(1, 0, 0)] })]);
const lemon = inst(comp('🍋 Search [ver 1.0]', 'kl'), { width: 360, height: 50 });
const web = inst(comp('Type=1', 'kw', true, '🏀 Empty State'), { width: 300, height: 200 }, [inst(comp('S', 'kwb', true, '🏀 Buttons / Base / Primary'), { width: 300, height: 48 }, [txt('Закрыть')])]);
const btns = node('FRAME', 'buttons', { layoutMode: 'VERTICAL', itemSpacing: 12, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, width: 328 }, [inst(comp('S', 'ks', true, '🍏 Button / Base / Secondary'), { width: 328, height: 48 }, [txt('Понятно')]), inst(comp('S', 'kp2', true, '🍏 Button / Base / Primary'), { width: 328, height: 48 }, [txt('Оформить')])]);
const inline = inst(comp('S', 'kin', true, '🍏 Inline button / Base / Primary'), { width: 80, height: 28 }, [txt('Изменить')]);
const container = node('FRAME', 'Group Section', { layoutMode: 'VERTICAL', itemSpacing: 4, paddingTop: 0, paddingBottom: 0, width: 360 }, [sec1, sec2]);
const screen = node('FRAME', 'Экран', { id: '1:1', fills: [solid(0.9, 0.9, 0.9, 'v1')], effects: [{ type: 'DROP_SHADOW', visible: true }], effectStyleId: 'sx', height: 800 }, [container, sheet, iconHand, logo, lemon, web, btns, inline]);
const page = { type: 'PAGE', name: 'Page', children: [screen] }; screen.parent = page;
const all = {}; const idx = x => { all[x.id] = x; (x.children || []).forEach(idx); }; idx(screen);
globalThis.figma = {
  mixed: Symbol('mixed'),
  getNodeByIdAsync: async id => all[id] || null,
  setCurrentPageAsync: async () => {},
  getStyleByIdAsync: async id => styles[id] || (id === 'sx' ? { name: 'Display' } : null),
  variables: { getVariableByIdAsync: async id => vars[id] || null, getVariableCollectionByIdAsync: async id => cols[id] || null },
};
const fn = new (Object.getPrototypeOf(async function () {}).constructor)(src);
const res = await fn();
const rules = new Set(Object.keys(res.byRule).map(k => k.split(' ')[1]));
const expected = ['container-spacing', 'container-radius', 'deprecated-token', 'no-text-style', 'hex', 'manual-bottomsheet', 'deprecated-style', 'primitive', 'icon-hex', 'detached', 'web-component', 'secondary-primary', 'button-order', 'multi-primary', 'illustration-meaning'];
const missing = expected.filter(r => !rules.has(r));
const errors = [];
if (missing.length) errors.push('Не сработали правила: ' + missing.join(', '));
if (res.skipped.platform !== 1) errors.push('Компонент 🍋 должен быть пропущен');
if (res.groups.some(g => g.ids.includes('1:1') && g.r === 'deprecated-style')) errors.push('Тень-подложка экрана не должна помечаться');
if (res.groups.some(g => /Inline/.test(g.m))) errors.push('Inline button не должен считаться Primary');
if (res.groups.filter(g => g.r === 'icon-hex').length !== 1) errors.push('Самодельная иконка — ровно одна пометка icon-hex');
if (errors.length) { console.error('FAIL\n' + errors.join('\n')); process.exit(1); }
console.log(`OK  tests/mock-audit.mjs: ${res.totals.groups} групп, правил: ${rules.size}`);
