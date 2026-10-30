/*!
 * NSPanel Pro Card v1.3.0
 * Full-screen smart-home panel for Home Assistant — Sonoff NSPanel Pro (480×480) or phone.
 * Clock + weather start screen, settings menu (theme / language / accent colour),
 * recuperator, air conditioner(s), heat pump, solar inverter and custom buttons.
 * https://github.com/keziksdmitrijs-byte/nspanel-pro-card — MIT License
 */
(function () {
  'use strict';

  var VERSION = '1.3.0';
  var CARD = 'nspanel-pro-card';
  var EDITOR = 'nspanel-pro-card-editor';

  var ACCENTS = {
    blue: '#3b82f6', teal: '#14b8a6', green: '#22c55e', amber: '#f59e0b',
    orange: '#f97316', red: '#ef4444', pink: '#ec4899', purple: '#8b5cf6'
  };
  var COL = {
    heat: '#f97316', cool: '#38bdf8', dhw: '#ef4444', dry: '#14b8a6', fan: '#94a3b8',
    sun: '#f5b301', bat: '#22c55e', grid: '#a78bfa', home: '#3b82f6', tank: '#ec4899'
  };
  var LOCALES = { ru: 'ru-RU', lv: 'lv-LV', en: 'en-GB' };
  var LANG_NAMES = { ru: 'Русский', lv: 'Latviešu', en: 'English' };

  var WX_ICON = {
    'clear-night': 'mdi:weather-night', cloudy: 'mdi:weather-cloudy', exceptional: 'mdi:alert-circle-outline',
    fog: 'mdi:weather-fog', hail: 'mdi:weather-hail', lightning: 'mdi:weather-lightning',
    'lightning-rainy': 'mdi:weather-lightning-rainy', partlycloudy: 'mdi:weather-partly-cloudy',
    pouring: 'mdi:weather-pouring', rainy: 'mdi:weather-rainy', snowy: 'mdi:weather-snowy',
    'snowy-rainy': 'mdi:weather-snowy-rainy', sunny: 'mdi:weather-sunny', windy: 'mdi:weather-windy',
    'windy-variant': 'mdi:weather-windy-variant'
  };
  var WX_COLOR = {
    'clear-night': '#818cf8', cloudy: '#94a3b8', fog: '#94a3b8', hail: '#7dd3fc', lightning: '#facc15',
    'lightning-rainy': '#facc15', partlycloudy: '#fbbf24', pouring: '#38bdf8', rainy: '#38bdf8',
    snowy: '#bae6fd', 'snowy-rainy': '#7dd3fc', sunny: '#f5b301', windy: '#94a3b8', 'windy-variant': '#94a3b8',
    exceptional: '#ef4444'
  };

  /* ------------------------------------------------------------------ i18n */
  var T = {
    ru: {
      settings: 'Настройки', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', auto: 'Авто',
      language: 'Язык', accent: 'Цвет акцента',
      recuperator: 'Рекуператор', ac: 'Кондиционер', heatpump: 'Тепловой насос', solar: 'Солнечная станция',
      weather: 'Погода', on: 'Вкл', off: 'Выкл', unavailable: 'Недоступно',
      empty: 'Нет подключённых устройств. Откройте редактор карточки и включите нужные разделы.',
      target: 'Целевая темп.', indoor: 'В доме', outdoor: 'Улица', supply: 'Приток', extract: 'Вытяжка',
      exhaust: 'Выброс', recovery: 'Рекуперация', filter: 'Фильтр', days: 'дн.', night_cooling: 'Ночное охл.',
      fans: 'Вентиляторы', airflow: 'Расход',
      m_protection: 'Защита', m_economy: 'Эконом', m_comfort: 'Комфорт', m_boost: 'Интенсив', m_off: 'Выкл',
      errors: 'Ошибки', standby: 'Ожидание', mode_lbl: 'Режим', flow_speed: 'Скорость потока', data_short: 'Данные', status: 'Состояние', boiler: 'Бойлер', modes: 'Режим работы', functions: 'Функции', data: 'Все данные', ctl: 'Режимы и функции',
      hvac_auto: 'Авто', hvac_cool: 'Холод', hvac_heat: 'Тепло', hvac_dry: 'Осушение', hvac_fan_only: 'Вентиляция',
      hvac_heat_cool: 'Авто', hvac_off: 'Выкл',
      fan: 'Вентилятор', swing: 'Жалюзи', preset: 'Режим', room: 'В комнате',
      fan_auto: 'Авто', fan_low: 'Низкая', 'fan_medium low': 'Ниже средней', fan_medium: 'Средняя',
      'fan_medium high': 'Выше средней', fan_high: 'Высокая', fan_turbo: 'Турбо', fan_quiet: 'Тихая',
      preset_eco: 'Эко', preset_away: 'Не дома', preset_boost: 'Турбо', preset_none: 'Обычный', preset_sleep: 'Сон',
      preset_comfort: 'Комфорт', preset_home: 'Дома',
      swing_default: 'По умолч.', swing_full_swing: 'Качание', swing_fixed_upper: 'Вверх',
      swing_fixed_upper_middle: 'Выше центра', swing_fixed_middle: 'Центр', swing_fixed_lower_middle: 'Ниже центра',
      swing_fixed_lower: 'Вниз', swing_swing_upper: 'Кач. верх', swing_swing_upper_middle: 'Кач. выше центра',
      swing_swing_middle: 'Кач. центр', swing_swing_lower_middle: 'Кач. ниже центра', swing_swing_lower: 'Кач. низ',
      swing_off: 'Выкл', swing_on: 'Вкл', swing_vertical: 'Вертикально', swing_horizontal: 'Горизонтально', swing_both: 'Оба',
      x_quiet_mode: 'Тихий', x_xtra_fan: 'Доп. вент.', x_fresh_air: 'Свежий возд.', x_panel_light: 'Подсветка',
      hp_heat: 'Отопление', hp_cool: 'Охлаждение', hp_dhw: 'Горячая вода', hp_auto: 'Авто',
      st_off: 'Выключен', st_idle: 'Ожидание', st_heat: 'Нагрев', st_cool: 'Охлаждение', st_dhw: 'Нагрев ГВС',
      dhw: 'ГВС', flow: 'Подача', ret: 'Обратка', tank: 'Бак ГВС', compressor: 'Компрессор', power: 'Мощность',
      heat_out: 'Тепло', cop: 'COP', today: 'Сегодня', quiet: 'Тихий', weather_comp: 'Погодозав.',
      dhw_boost: 'Быстрый ГВС', curve: 'погодозависимый режим',
      pv: 'Солнце', home: 'Дом', battery: 'Батарея', grid: 'Сеть', produced: 'Выработка', import: 'Импорт',
      export: 'Экспорт', self_use: 'Самопотреб.',
      humidity: 'Влажность', wind: 'Ветер', pressure: 'Давление',
      u_w: 'Вт', u_kw: 'кВт', u_kwh: 'кВт·ч', u_hz: 'Гц', u_rpm: 'об/м', u_ms: 'м/с', u_hpa: 'гПа',
      w: {
        'clear-night': 'Ясно', cloudy: 'Облачно', exceptional: 'Опасная погода', fog: 'Туман', hail: 'Град',
        lightning: 'Гроза', 'lightning-rainy': 'Гроза, дождь', partlycloudy: 'Переменная облачность',
        pouring: 'Ливень', rainy: 'Дождь', snowy: 'Снег', 'snowy-rainy': 'Мокрый снег', sunny: 'Солнечно',
        windy: 'Ветрено', 'windy-variant': 'Ветрено, облачно'
      }
    },
    lv: {
      settings: 'Iestatījumi', theme: 'Tēma', dark: 'Tumšā', light: 'Gaišā', auto: 'Auto',
      language: 'Valoda', accent: 'Akcenta krāsa',
      recuperator: 'Rekuperators', ac: 'Kondicionieris', heatpump: 'Siltumsūknis', solar: 'Saules stacija',
      weather: 'Laikapstākļi', on: 'Iesl.', off: 'Izsl.', unavailable: 'Nav pieejams',
      empty: 'Nav pievienotu ierīču. Atveriet kartītes redaktoru un ieslēdziet vajadzīgās sadaļas.',
      target: 'Mērķa temp.', indoor: 'Telpā', outdoor: 'Ārā', supply: 'Pieplūde', extract: 'Nosūce',
      exhaust: 'Izplūde', recovery: 'Rekuperācija', filter: 'Filtrs', days: 'd.', night_cooling: 'Nakts dzes.',
      fans: 'Ventilatori', airflow: 'Plūsma',
      m_protection: 'Aizsardzība', m_economy: 'Ekonomija', m_comfort: 'Komforts', m_boost: 'Intensīvs', m_off: 'Izsl.',
      errors: 'Kļūdas', standby: 'Gaidīšanas režīms', mode_lbl: 'Režīms', flow_speed: 'Plūsmas ātrums', data_short: 'Dati', status: 'Statuss', boiler: 'Boileris', modes: 'Darba režīms', functions: 'Funkcijas', data: 'Visi dati', ctl: 'Režīmi un funkcijas',
      hvac_auto: 'Auto', hvac_cool: 'Dzesēt', hvac_heat: 'Sildīt', hvac_dry: 'Žāvēt', hvac_fan_only: 'Ventilēt',
      hvac_heat_cool: 'Auto', hvac_off: 'Izsl.',
      fan: 'Ventilators', swing: 'Žalūzijas', preset: 'Režīms', room: 'Telpā',
      fan_auto: 'Auto', fan_low: 'Zems', 'fan_medium low': 'Vidēji zems', fan_medium: 'Vidējs',
      'fan_medium high': 'Vidēji augsts', fan_high: 'Augsts', fan_turbo: 'Turbo', fan_quiet: 'Kluss',
      preset_eco: 'Eko', preset_away: 'Prombūtne', preset_boost: 'Turbo', preset_none: 'Parasts', preset_sleep: 'Miegs',
      preset_comfort: 'Komforts', preset_home: 'Mājās',
      swing_default: 'Noklus.', swing_full_swing: 'Šūpošana', swing_fixed_upper: 'Augšā',
      swing_fixed_upper_middle: 'Virs vidus', swing_fixed_middle: 'Vidū', swing_fixed_lower_middle: 'Zem vidus',
      swing_fixed_lower: 'Lejā', swing_swing_upper: 'Šūp. augšā', swing_swing_upper_middle: 'Šūp. virs vidus',
      swing_swing_middle: 'Šūp. vidū', swing_swing_lower_middle: 'Šūp. zem vidus', swing_swing_lower: 'Šūp. lejā',
      swing_off: 'Izsl.', swing_on: 'Iesl.', swing_vertical: 'Vertikāli', swing_horizontal: 'Horizontāli', swing_both: 'Abi',
      x_quiet_mode: 'Klusais', x_xtra_fan: 'Papildu vent.', x_fresh_air: 'Svaigs gaiss', x_panel_light: 'Displejs',
      hp_heat: 'Apkure', hp_cool: 'Dzesēšana', hp_dhw: 'Karstais ūdens', hp_auto: 'Auto',
      st_off: 'Izslēgts', st_idle: 'Gaidīšana', st_heat: 'Sildīšana', st_cool: 'Dzesēšana', st_dhw: 'KŪ sildīšana',
      dhw: 'KŪ', flow: 'Turpgaita', ret: 'Atgaita', tank: 'KŪ tvertne', compressor: 'Kompresors', power: 'Jauda',
      heat_out: 'Siltums', cop: 'COP', today: 'Šodien', quiet: 'Klusais', weather_comp: 'Laika līkne',
      dhw_boost: 'Ātrais KŪ', curve: 'laikapstākļu līkne',
      pv: 'Saule', home: 'Māja', battery: 'Akumulators', grid: 'Tīkls', produced: 'Saražots', import: 'Imports',
      export: 'Eksports', self_use: 'Pašpatēriņš',
      humidity: 'Mitrums', wind: 'Vējš', pressure: 'Spiediens',
      u_w: 'W', u_kw: 'kW', u_kwh: 'kWh', u_hz: 'Hz', u_rpm: 'apgr.', u_ms: 'm/s', u_hpa: 'hPa',
      w: {
        'clear-night': 'Skaidrs', cloudy: 'Mākoņains', exceptional: 'Bīstami laikapstākļi', fog: 'Migla',
        hail: 'Krusa', lightning: 'Pērkona negaiss', 'lightning-rainy': 'Negaiss ar lietu',
        partlycloudy: 'Daļēji mākoņains', pouring: 'Lietusgāze', rainy: 'Lietus', snowy: 'Sniegs',
        'snowy-rainy': 'Slapjš sniegs', sunny: 'Saulains', windy: 'Vējains', 'windy-variant': 'Vējains, mākoņains'
      }
    },
    en: {
      settings: 'Settings', theme: 'Theme', dark: 'Dark', light: 'Light', auto: 'Auto',
      language: 'Language', accent: 'Accent colour',
      recuperator: 'Recuperator', ac: 'Air conditioner', heatpump: 'Heat pump', solar: 'Solar plant',
      weather: 'Weather', on: 'On', off: 'Off', unavailable: 'Unavailable',
      empty: 'No devices configured. Open the card editor and enable the sections you need.',
      target: 'Target temp.', indoor: 'Indoor', outdoor: 'Outdoor', supply: 'Supply', extract: 'Extract',
      exhaust: 'Exhaust', recovery: 'Recovery', filter: 'Filter', days: 'd', night_cooling: 'Night cool',
      fans: 'Fans', airflow: 'Airflow',
      m_protection: 'Protection', m_economy: 'Economy', m_comfort: 'Comfort', m_boost: 'Boost', m_off: 'Off',
      errors: 'Errors', standby: 'Standby', mode_lbl: 'Mode', flow_speed: 'Airflow speed', data_short: 'Data', status: 'Status', boiler: 'Boiler', modes: 'Operating mode', functions: 'Functions', data: 'All data', ctl: 'Modes & functions',
      hvac_auto: 'Auto', hvac_cool: 'Cool', hvac_heat: 'Heat', hvac_dry: 'Dry', hvac_fan_only: 'Fan',
      hvac_heat_cool: 'Auto', hvac_off: 'Off',
      fan: 'Fan', swing: 'Swing', preset: 'Preset', room: 'Room',
      fan_auto: 'Auto', fan_low: 'Low', 'fan_medium low': 'Medium-low', fan_medium: 'Medium',
      'fan_medium high': 'Medium-high', fan_high: 'High', fan_turbo: 'Turbo', fan_quiet: 'Quiet',
      preset_eco: 'Eco', preset_away: 'Away', preset_boost: 'Boost', preset_none: 'Normal', preset_sleep: 'Sleep',
      preset_comfort: 'Comfort', preset_home: 'Home',
      swing_default: 'Default', swing_full_swing: 'Full swing', swing_fixed_upper: 'Up',
      swing_fixed_upper_middle: 'Upper-middle', swing_fixed_middle: 'Middle', swing_fixed_lower_middle: 'Lower-middle',
      swing_fixed_lower: 'Down', swing_swing_upper: 'Swing up', swing_swing_upper_middle: 'Swing upper-mid',
      swing_swing_middle: 'Swing middle', swing_swing_lower_middle: 'Swing lower-mid', swing_swing_lower: 'Swing down',
      swing_off: 'Off', swing_on: 'On', swing_vertical: 'Vertical', swing_horizontal: 'Horizontal', swing_both: 'Both',
      x_quiet_mode: 'Quiet', x_xtra_fan: 'Xtra fan', x_fresh_air: 'Fresh air', x_panel_light: 'Display',
      hp_heat: 'Heating', hp_cool: 'Cooling', hp_dhw: 'Hot water', hp_auto: 'Auto',
      st_off: 'Off', st_idle: 'Idle', st_heat: 'Heating', st_cool: 'Cooling', st_dhw: 'Heating DHW',
      dhw: 'DHW', flow: 'Flow', ret: 'Return', tank: 'DHW tank', compressor: 'Compressor', power: 'Power',
      heat_out: 'Heat', cop: 'COP', today: 'Today', quiet: 'Quiet', weather_comp: 'Weather comp.',
      dhw_boost: 'DHW boost', curve: 'weather compensation',
      pv: 'Solar', home: 'Home', battery: 'Battery', grid: 'Grid', produced: 'Produced', import: 'Import',
      export: 'Export', self_use: 'Self-use',
      humidity: 'Humidity', wind: 'Wind', pressure: 'Pressure',
      u_w: 'W', u_kw: 'kW', u_kwh: 'kWh', u_hz: 'Hz', u_rpm: 'rpm', u_ms: 'm/s', u_hpa: 'hPa',
      w: {
        'clear-night': 'Clear', cloudy: 'Cloudy', exceptional: 'Exceptional', fog: 'Fog', hail: 'Hail',
        lightning: 'Thunderstorm', 'lightning-rainy': 'Thunderstorm, rain', partlycloudy: 'Partly cloudy',
        pouring: 'Pouring', rainy: 'Rain', snowy: 'Snow', 'snowy-rainy': 'Sleet', sunny: 'Sunny',
        windy: 'Windy', 'windy-variant': 'Windy, cloudy'
      }
    }
  };

  var REC_MODES = [
    ['off', /выкл|izslēg|izsl|^off$/i],
    ['protection', /защит|aizsardz|protect/i],
    ['economy', /эконом|ekonom|econ/i],
    ['comfort', /комфорт|komfort|normāl|normal|comfort/i],
    ['boost', /интенсив|intens|boost/i]
  ];
  var HP_MODES = [
    ['heat', /^heat$|heating|отоп|нагрев|apkur|sild/i, 'mdi:radiator'],
    ['cool', /^cool$|cooling|охлаж|dzes/i, 'mdi:snowflake'],
    ['dhw', /^dhw$|гвс|hot.?water|water|ūden|бойлер|boiler/i, 'mdi:water-boiler'],
    ['auto', /^auto$|авто|automatic/i, 'mdi:thermostat-auto']
  ];
  var HP_STATUS = [
    ['off', /^off$|выкл|izsl/i],
    ['dhw', /dhw|гвс|hot.?water|ūden|boiler|бойлер/i],
    ['cool', /cool|охлаж|dzes/i],
    ['heat', /heat|нагрев|отоп|apkur|sild/i],
    ['idle', /idle|standby|stand-by|ожидан|gaid|pause/i]
  ];
  var HVAC_ICON = {
    auto: 'mdi:thermostat-auto', heat_cool: 'mdi:sun-snowflake-variant', cool: 'mdi:snowflake', heat: 'mdi:fire',
    dry: 'mdi:water-percent', fan_only: 'mdi:fan', off: 'mdi:power'
  };
  var REC_ICON = { protection: 'mdi:shield-home-outline', economy: 'mdi:leaf', comfort: 'mdi:sofa-outline', boost: 'mdi:fan-plus', off: 'mdi:power' };
  var HVAC_COL = { cool: COL.cool, heat: COL.heat, dry: COL.dry, fan_only: COL.fan };
  var AC_SWITCHES = [
    ['quiet_mode', 'mdi:volume-off'], ['xtra_fan', 'mdi:fan-plus'], ['fresh_air', 'mdi:leaf'], ['panel_light', 'mdi:lightbulb-outline']
  ];
  var ON_STATES = ['on', 'open', 'opening', 'unlocked', 'playing', 'home', 'heat', 'cool', 'auto', 'heat_cool', 'dry', 'fan_only', 'active', 'cleaning'];

  /* --------------------------------------------------------------- helpers */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ic(name, cls, style) {
    return '<ha-icon icon="' + esc(name) + '"' + (cls ? ' class="' + cls + '"' : '') + (style ? ' style="' + style + '"' : '') + '></ha-icon>';
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function hexRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function pretty(s) { return cap(String(s).replace(/_/g, ' ')); }
  function isObj(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function unitOf(s) { return s && s.attributes ? String(s.attributes.unit_of_measurement || '').toLowerCase() : ''; }
  function toW(s) {
    if (!s) return NaN;
    var v = parseFloat(s.state);
    if (isNaN(v)) return NaN;
    var u = unitOf(s);
    return u === 'kw' ? v * 1000 : u === 'mw' ? v * 1e6 : v;
  }
  function toKwh(s) {
    if (!s) return NaN;
    var v = parseFloat(s.state);
    if (isNaN(v)) return NaN;
    var u = unitOf(s);
    return u === 'wh' ? v / 1000 : u === 'mwh' ? v * 1000 : v;
  }
  function toKw(s) {
    if (!s) return NaN;
    var v = parseFloat(s.state);
    if (isNaN(v)) return NaN;
    var u = unitOf(s);
    return u === 'w' ? v / 1000 : u === 'mw' ? v * 1000 : v;
  }

  function collectEntities(obj, out) {
    if (!obj) return out;
    if (typeof obj === 'string') {
      if (/^[a-z_]+\.[a-z0-9_]+$/.test(obj)) out[obj] = 1;
    } else if (Array.isArray(obj)) {
      obj.forEach(function (x) { collectEntities(x, out); });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(function (k) { collectEntities(obj[k], out); });
    }
    return out;
  }

  /* Normalise user config → internal structure */
  function normConfig(c) {
    var n = Object.assign({ device: 'nspanel', show_settings: true, theme: 'dark', accent: 'blue' }, c);
    if (n.device !== 'phone') n.device = 'nspanel';
    if (n.home_timeout === undefined || n.home_timeout === null || n.home_timeout === '') n.home_timeout = n.device === 'phone' ? 0 : 90;
    function sec(o) { return isObj(o) && o.enabled !== false ? o : null; }
    n._rec = sec(c.recuperator);
    var acSec = c.air_conditioner, list = [];
    if (isObj(acSec)) { if (acSec.enabled !== false) list = acSec.entities || []; }
    else if (c.air_conditioners) list = c.air_conditioners;
    n._acs = (list || []).map(function (a) { return typeof a === 'string' ? { entity: a } : a; })
      .filter(function (a) { return a && a.entity; });
    n._acTitle = isObj(acSec) ? acSec.name : null;
    n._hp = sec(c.heat_pump);
    if (n._hp && !n._hp.electric_power && n._hp.power_kw) n._hp = Object.assign({}, n._hp, { electric_power: n._hp.power_kw });
    n._solar = sec(c.solar);
    n._ss = isObj(c.screensaver) && c.screensaver.enabled !== false ? c.screensaver : null;
    n._buttons = (c.custom_buttons || []).filter(function (b) {
      return isObj(b) && b.enabled !== false && (b.name || b.entity || b.navigation_path || b.url);
    });
    return n;
  }

  /* minimal DOM morphing: keeps elements (and their animations) alive between renders */
  function sameNode(a, b) {
    return a.nodeType === b.nodeType && (a.nodeType !== 1 ||
      (a.tagName === b.tagName && a.getAttribute('data-k') === b.getAttribute('data-k')));
  }
  function morphAttrs(f, t) {
    var i, ta = t.attributes, fa = f.attributes;
    for (i = 0; i < ta.length; i++) {
      if (f.getAttribute(ta[i].name) !== ta[i].value) f.setAttribute(ta[i].name, ta[i].value);
    }
    for (i = fa.length - 1; i >= 0; i--) {
      if (!t.hasAttribute(fa[i].name)) f.removeAttribute(fa[i].name);
    }
  }
  function morphChildren(from, to) {
    var tch = Array.prototype.slice.call(to.childNodes);
    for (var i = 0; i < tch.length; i++) {
      var t = tch[i], f = from.childNodes[i];
      if (!f) { from.appendChild(t); continue; }
      if (!sameNode(f, t)) { from.replaceChild(t, f); continue; }
      if (f.nodeType !== 1) { if (f.nodeValue !== t.nodeValue) f.nodeValue = t.nodeValue; continue; }
      morphAttrs(f, t);
      if (f.tagName !== 'HA-ICON') morphChildren(f, t);
    }
    while (from.childNodes.length > tch.length) from.removeChild(from.lastChild);
  }
  function morphHTML(el, html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    morphChildren(el, tpl.content);
  }

  /* ------------------------------------------------------------------ styles */
  var STYLE = [
    ':host{display:block;position:relative;overflow:hidden}',
    '*{box-sizing:border-box}',
    '.screen{position:relative;margin:0 auto;overflow:hidden;font-family:var(--nsp-font,Roboto,"Segoe UI",Helvetica,Arial,sans-serif);',
    'color:var(--tx);background:var(--bg);-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;',
    'font-variant-numeric:tabular-nums;transition:background .3s,color .3s}',
    '.t-dark{--bg:#0d1015;--sf:#171b22;--sf2:#1e232c;--sf3:#272d38;--tx:#f2f4f8;--tx2:#9aa3b2;--tx3:#687284;',
    '--track:rgba(255,255,255,.08);--sh:inset 0 1px 0 rgba(255,255,255,.035);--ov:rgba(0,0,0,.55)}',
    '.t-light{--bg:#eceff4;--sf:#ffffff;--sf2:#f5f7fa;--sf3:#e9edf2;--tx:#0f1724;--tx2:#5a6475;--tx3:#8a93a3;',
    '--track:rgba(15,23,36,.08);--sh:0 1px 2px rgba(16,24,40,.06),0 1px 3px rgba(16,24,40,.05);--ov:rgba(15,23,36,.35)}',
    'button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;outline:none;',
    'text-align:inherit;-webkit-tap-highlight-color:transparent;transition:transform .12s,background .2s,color .2s,box-shadow .2s}',
    'button:active{transform:scale(.96)}',
    'ha-icon{--mdc-icon-size:24px;display:inline-flex;flex:none}',
    '.page{position:absolute;top:0;left:0;right:0;bottom:0;padding:12px;display:flex;flex-direction:column;',
    'overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}',
    '.page::-webkit-scrollbar{display:none}',
    '.page>*{flex:none}.page>*+*{margin-top:10px}',
    '.page.enter{animation:pin .22s ease-out}',
    '@keyframes pin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '@keyframes spin{to{transform:rotate(360deg)}}',
    '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}',
    '@keyframes up{from{transform:translateY(100%)}to{transform:none}}',
    '@keyframes fo{from{opacity:0}to{opacity:1}}',
    '.spin{animation:spin var(--spd,2s) linear infinite}',
    '.pulse{animation:pulse 1.6s ease-in-out infinite}',
    /* header */
    '.hdr{display:flex;align-items:center;height:46px}',
    '.ib{width:46px;height:46px;border-radius:15px;background:var(--sf);display:flex;align-items:center;justify-content:center;box-shadow:var(--sh);flex:none}',
    '.hdr-t{flex:1;min-width:0;margin-left:10px}',
    '.ttl{font-size:20px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}',
    '.sub{font-size:12.5px;color:var(--tx2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}',
    '.sub.err{color:#ef4444}',
    '.pwr{width:46px;height:46px;border-radius:50%;background:var(--sf);color:var(--tx2);display:flex;align-items:center;',
    'justify-content:center;margin-left:8px;box-shadow:var(--sh);flex:none}',
    '.pwr.on{background:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(var(--acc-rgb),.45)}',
    '.pills{display:flex;margin-left:6px;flex:none}',
    '.pill{min-width:34px;height:34px;padding:0 8px;border-radius:11px;background:var(--sf);font-size:14px;font-weight:600;',
    'color:var(--tx2);margin-left:5px;box-shadow:var(--sh);text-align:center;position:relative}',
    '.pill.on{background:rgba(var(--acc-rgb),.18);color:var(--accent)}',
    '.pill .dot{position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;background:var(--accent)}',
    '.pill .dot.na{background:#ef4444}',
    /* home */
    '.h-top{display:flex;align-items:center;justify-content:space-between;height:46px}',
    '.date{font-size:16px;color:var(--tx2);font-weight:500;padding-left:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.h-mid{display:flex;align-items:center;justify-content:space-between;height:100px}',
    '.page>.h-mid{margin-top:2px}',
    '.time{font-size:88px;font-weight:300;letter-spacing:-3px;line-height:1}',
    '.wx{display:flex;align-items:center;background:var(--sf);border-radius:22px;padding:10px 14px 10px 10px;box-shadow:var(--sh);max-width:210px;min-width:0}',
    '.wx-ic{--mdc-icon-size:46px;margin-right:8px}',
    '.wx-t{font-size:30px;font-weight:600;line-height:1}',
    '.wx-c{font-size:12.5px;color:var(--tx2);margin-top:4px;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.wx-hl{font-size:12px;color:var(--tx3);margin-top:2px;white-space:nowrap}',
    '.tiles{flex:1 1 auto;display:grid;grid-gap:10px;gap:10px;min-height:0}',
    '.tile{background:var(--sf);border-radius:22px;padding:13px 14px;display:flex;flex-direction:column;box-shadow:var(--sh);',
    'position:relative;overflow:hidden;min-height:0;text-align:left;min-width:0}',
    '.tile.act{background:linear-gradient(140deg,rgba(var(--acc-rgb),.24),rgba(var(--acc-rgb),.05) 70%),var(--sf)}',
    '.t-row{display:flex;align-items:flex-start;justify-content:space-between}',
    '.t-ic{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:var(--sf3);color:var(--tx2);flex:none}',
    '.tile.act .t-ic{background:var(--accent);color:#fff;box-shadow:0 6px 16px rgba(var(--acc-rgb),.38)}',
    '.t-val{font-size:22px;font-weight:600;white-space:nowrap;margin-left:6px;overflow:hidden;text-overflow:ellipsis}',
    '.t-val small{font-size:13px;color:var(--tx2);font-weight:500;margin-left:2px}',
    '.t-name{font-size:17px;font-weight:600;margin-top:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.t-st{font-size:13px;color:var(--tx2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:1em}',
    '.tiles.cmp .tile{padding:10px 11px;border-radius:19px}',
    '.tiles.cmp .t-ic{width:38px;height:38px;border-radius:12px;--mdc-icon-size:21px}',
    '.tiles.cmp .t-val{font-size:18px}.tiles.cmp .t-name{font-size:15px}.tiles.cmp .t-st{font-size:12px}',
    '.tiles.xs .tile{padding:8px 10px;border-radius:16px}',
    '.tiles.xs .t-ic{width:32px;height:32px;border-radius:10px;--mdc-icon-size:18px}',
    '.tiles.xs .t-val{font-size:15px}.tiles.xs .t-name{font-size:13.5px}.tiles.xs .t-st{font-size:11px;margin-top:0}',
    '.empty{flex:1 1 auto;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--tx2);',
    'background:var(--sf);border-radius:22px;padding:24px;font-size:15px;line-height:1.5}',
    /* control row: ring + stepper */
    '.ctl{display:flex;align-items:stretch}',
    '.ring-w{position:relative;flex:none;background:var(--sf);border-radius:24px;box-shadow:var(--sh);padding:6px}',
    '.ring-w.solo{flex:1 1 auto;display:flex;justify-content:center}',
    '.ring-w svg{display:block}',
    '.arc{transition:stroke-dasharray .6s ease,stroke .3s}',
    '.ring-c{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}',
    '.ring-i{color:var(--rc,var(--accent));--mdc-icon-size:26px;margin-bottom:2px}',
    '.ring-v{font-size:36px;font-weight:600;line-height:1}',
    '.ring-v small{font-size:16px;color:var(--tx2);font-weight:500}',
    '.ring-l{font-size:12px;color:var(--tx2);margin-top:4px;max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.col{flex:1;min-width:0;margin-left:10px;display:flex;flex-direction:column}',
    '.col>*+*{margin-top:10px}',
    '.stp{flex:1;background:var(--sf);border-radius:22px;padding:10px 12px;box-shadow:var(--sh);display:flex;flex-direction:column;justify-content:center;min-height:0}',
    '.stp-l{font-size:13px;color:var(--tx2);display:flex;align-items:center;white-space:nowrap;overflow:hidden}',
    '.stp-l ha-icon{--mdc-icon-size:16px;margin-right:5px}',
    '.stp-r{display:flex;align-items:center;justify-content:space-between;margin-top:6px}',
    '.stp-b{width:50px;height:50px;border-radius:16px;background:var(--sf3);display:flex;align-items:center;justify-content:center;flex:none}',
    '.stp-b.dis{opacity:.35;pointer-events:none}',
    '.stp-v{font-size:32px;font-weight:600;text-align:center;flex:1;white-space:nowrap}',
    '.stp-v small{font-size:15px;color:var(--tx2);font-weight:500}',
    '.stp.sm .stp-b{width:42px;height:42px;border-radius:14px}',
    '.stp.sm .stp-v{font-size:25px}',
    '.stp.sm .stp-r{margin-top:3px}',
    '.note{font-size:11.5px;color:var(--tx3);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    /* segmented / mode buttons */
    '.seg{display:grid;grid-gap:8px;gap:8px}',
    '.n1{grid-template-columns:minmax(0,1fr)}.n2{grid-template-columns:repeat(2,minmax(0,1fr))}.n3{grid-template-columns:repeat(3,minmax(0,1fr))}',
    '.n4{grid-template-columns:repeat(4,minmax(0,1fr))}.n5{grid-template-columns:repeat(5,minmax(0,1fr))}.n6{grid-template-columns:repeat(6,minmax(0,1fr))}',
    '.sb{height:58px;border-radius:17px;background:var(--sf);display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'font-size:12.5px;font-weight:500;color:var(--tx2);box-shadow:var(--sh);min-width:0;padding:0 4px;text-align:center}',
    '.sb span{display:block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sb ha-icon{--mdc-icon-size:22px;margin-bottom:3px}',
    '.sb.on{background:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(var(--acc-rgb),.35)}',
    '.sb.soft.on{background:rgba(var(--acc-rgb),.16);color:var(--accent);box-shadow:var(--sh)}',
    '.dis{opacity:.4;pointer-events:none}',
    '.sb.row{flex-direction:row;height:48px;font-size:13px}',
    '.sb.row ha-icon{margin:0 6px 0 0;--mdc-icon-size:20px}',
    '.sb.vert{height:52px}',
    /* option buttons (AC fan / swing / preset) */
    '.opt{height:54px;border-radius:17px;background:var(--sf);display:flex;align-items:center;padding:0 10px;box-shadow:var(--sh);min-width:0}',
    '.opt ha-icon{color:var(--accent);--mdc-icon-size:22px;margin-right:8px}',
    '.opt-t{min-width:0}',
    '.opt-l{font-size:11px;color:var(--tx2)}',
    '.opt-v{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    /* stats */
    '.stats{display:grid;grid-template-columns:repeat(4,1fr);grid-gap:8px;gap:8px}',
    '.st{background:var(--sf);border-radius:16px;padding:7px 10px;box-shadow:var(--sh);min-width:0;height:58px;display:flex;flex-direction:column;justify-content:center;text-align:left}',
    '.st-h{display:flex;align-items:center;color:var(--tx2);font-size:11px;white-space:nowrap;overflow:hidden}',
    '.st-h ha-icon{--mdc-icon-size:15px;margin-right:4px}',
    '.st-v{font-size:18px;font-weight:600;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.st-v small{font-size:11px;color:var(--tx2);font-weight:500;margin-left:2px}',
    '.st.on{background:rgba(var(--acc-rgb),.16)}.st.on .st-h{color:var(--accent)}',
    '.st.warn .st-h,.st.warn .st-v{color:#ef4444}',
    /* hero / mode button / KPIs */
    '.hero{flex:1 1 auto;min-height:0}',
    '.hero .ring-w{display:flex;align-items:center;justify-content:center}',
    '.hero .ring-v{font-size:50px;letter-spacing:-1px}.hero .ring-v small{font-size:19px}',
    '.hero .ring-i{--mdc-icon-size:30px;margin-bottom:4px}.hero .ring-l{font-size:13.5px;margin-top:6px}',
    '.hero .stp{padding:12px 14px}.hero .stp-l{font-size:14px}',
    '.hero .stp-v{font-size:46px;letter-spacing:-1px}.hero .stp-v small{font-size:18px}',
    '.hero .stp-b{width:58px;height:58px;border-radius:18px}',
    '.hero .stp:not(.sm) .stp-l{justify-content:center}.hero .stp:not(.sm) .note{text-align:center;margin-top:6px}',
    '.hero .stp:not(.sm) .stp-r{display:grid;grid-template-columns:1fr 1fr;grid-template-areas:"v v" "m p";grid-gap:10px;gap:10px;margin-top:4px}',
    '.hero .stp:not(.sm) .stp-v{grid-area:v;font-size:54px;line-height:1.1}',
    '.hero .stp:not(.sm) .stp-b{width:auto;height:54px}',
    '.hero .stp:not(.sm) .stp-b:first-child{grid-area:m}.hero .stp:not(.sm) .stp-b:last-child{grid-area:p}',
    '.hero .stp.sm{padding:8px 12px}.hero .stp.sm .stp-v{font-size:32px}.hero .stp.sm .stp-v small{font-size:15px}',
    '.hero .stp.sm .stp-b{width:46px;height:46px;border-radius:15px}.hero .stp.sm .note{margin-top:1px}',
    '.mbtn{width:100%;height:66px;border-radius:20px;background:var(--sf);display:flex;align-items:center;padding:0 12px 0 10px;box-shadow:var(--sh);text-align:left}',
    '.mb-ic{width:46px;height:46px;border-radius:15px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;flex:none}',
    '.mb-t{flex:1;min-width:0;margin-left:12px}',
    '.mb-v{font-size:19px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.mb-s{font-size:12.5px;color:var(--tx2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.mb-more{width:40px;height:40px;border-radius:13px;background:var(--sf3);display:flex;align-items:center;justify-content:center;color:var(--tx2);flex:none;margin-left:8px}',
    '.kpis{display:grid;grid-gap:8px;gap:8px}',
    '.ring-c{pointer-events:none}',
    '.ring-m{font-size:15px;font-weight:600;color:var(--tx2);margin-top:2px}.ring-m.acc{color:var(--accent)}',
    '.p-rec .ring-l{max-width:170px}',
    '.rcard{flex:1 1 0;min-width:0;background:var(--sf);border-radius:24px;box-shadow:var(--sh);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px}',
    '.rcard .ring-w{background:none;box-shadow:none;padding:0}',
    '.rec-q .col{flex:1 1 0}',
    '.p-rec .hero .ring-v{font-size:52px}.p-rec .hero .ring-v small{font-size:20px}',
    '.p-rec .ring-l{max-width:130px}',
    '.rc-b{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;gap:10px;width:100%;margin-top:6px}',
    '.rc-b .stp-b{width:auto;height:48px;border-radius:15px}',
    '.vcard{flex:1;background:var(--sf);border-radius:22px;box-shadow:var(--sh);padding:12px 14px;display:flex;flex-direction:column;justify-content:center;min-height:0}',
    '.vc-l{display:flex;align-items:center;font-size:14px;color:var(--tx2);white-space:nowrap;overflow:hidden}.vc-l ha-icon{--mdc-icon-size:18px;margin-right:6px}',
    '.vc-v{font-size:46px;font-weight:600;line-height:1.1;margin-top:4px;letter-spacing:-1px;white-space:nowrap}.vc-v small{font-size:18px;color:var(--tx2);font-weight:500;margin-left:2px;letter-spacing:0}',
    '.vc-n{font-size:12.5px;color:var(--tx3);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.rec-btns .mbtn.sm{height:86px;border-radius:22px;padding:0 12px}',
    '.rec-btns .mbtn.sm .mb-ic{width:52px;height:52px;border-radius:17px}.rec-btns .mbtn.sm .mb-ic ha-icon{--mdc-icon-size:28px}',
    '.rec-btns .mbtn.sm .mb-v{font-size:20px}.rec-btns .mbtn.sm .mb-s{font-size:12.5px}',
    '.dev-phone .rcard{flex:none}',
    '.dev-phone .rec-btns .mb-more{display:none}',
    '.dev-phone .rec-q .col{flex:none}',
    '.sh-g.c1{grid-template-columns:1fr}',
    '.fb{width:62px;height:62px;border-radius:50%;background:var(--sf3);display:flex;align-items:center;justify-content:center;margin:0 18px;flex:none;position:relative;z-index:1}',
    '.fb ha-icon{--mdc-icon-size:28px}',
    '.p-rec .hero .ring-v{font-size:64px}.p-rec .hero .ring-v small{font-size:24px}',
    '.r2-v{font-size:34px;font-weight:600;line-height:1;letter-spacing:-1px}.r2-v small{font-size:16px;color:var(--tx2);font-weight:500}',
    '.r2-v.b{font-size:26px;margin-top:6px}',
    '.r2-l{font-size:11.5px;color:var(--tx2);margin-top:1px}',
    '.ring-i.sm{--mdc-icon-size:22px;margin-bottom:2px}',
    '.tline{display:flex;align-items:center;height:64px;background:var(--sf);border-radius:20px;box-shadow:var(--sh);padding:0 9px 0 14px}',
    '.tl-i{color:var(--tx2);--mdc-icon-size:22px}',
    '.tl-t{flex:1;min-width:0;margin-left:8px}',
    '.tl-l{font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.tl-n{font-size:11.5px;color:var(--tx3);margin-top:1px;white-space:nowrap}',
    '.tl-v{font-size:26px;font-weight:600;margin:0 10px;white-space:nowrap}.tl-v small{font-size:13px;color:var(--tx2);font-weight:500}',
    '.tline .stp-b{width:46px;height:46px;border-radius:15px;margin-left:6px}',
    '.mbtn.sm{height:62px;padding:0 8px 0 8px;border-radius:19px}',
    '.mbtn.sm .mb-ic{width:42px;height:42px;border-radius:14px}',
    '.mbtn.sm .mb-t{margin-left:10px}.mbtn.sm .mb-v{font-size:16.5px}.mbtn.sm .mb-s{font-size:11.5px}',
    '.mbtn.sm .mb-more{width:30px;height:30px;border-radius:10px;margin-left:4px}',
    '.mbtn.sm .mb-more ha-icon{--mdc-icon-size:20px}',
    '.dev-phone .fb{margin:0 2px;width:44px;height:44px}',
    '.kpi{background:var(--sf);border-radius:20px;padding:10px 12px;box-shadow:var(--sh);min-width:0;height:86px;display:flex;flex-direction:column;justify-content:space-between}',
    '.kpi-l{display:flex;align-items:center;font-size:12px;color:var(--tx2);white-space:nowrap;overflow:hidden}',
    '.kpi-l ha-icon{--mdc-icon-size:16px;margin-right:5px}',
    '.kpi-v{font-size:26px;font-weight:600;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.5px}',
    '.kpi-v small{font-size:14px;color:var(--tx2);font-weight:500;margin-left:3px;letter-spacing:0}',
    '.kpi.warn .kpi-l,.kpi.warn .kpi-v{color:#ef4444}',
    /* menu */
    '.sec{background:var(--sf);border-radius:20px;padding:11px 12px 12px;box-shadow:var(--sh)}',
    '.sec-t{display:flex;align-items:center;font-size:13.5px;font-weight:600;color:var(--tx2);margin-bottom:9px}',
    '.sec-t ha-icon{--mdc-icon-size:18px;margin-right:6px}',
    '.sec .sb{background:var(--sf2);box-shadow:none;height:52px}',
    '.sec .sb.on{background:var(--accent);color:#fff}',
    '.sw{display:grid;grid-template-columns:repeat(8,1fr);grid-gap:6px;gap:6px}',
    '.swc{width:40px;height:40px;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;color:#fff}',
    '.swc ha-icon{--mdc-icon-size:20px}',
    '.about{font-size:11px;color:var(--tx3);text-align:center}',
    /* weather page */
    '.wnow{display:flex;align-items:center;background:var(--sf);border-radius:22px;padding:12px 16px;box-shadow:var(--sh)}',
    '.wnow .wx-ic{--mdc-icon-size:64px;margin-right:12px}',
    '.wnow-t{font-size:46px;font-weight:600;line-height:1}',
    '.wnow-d{margin-left:auto;font-size:13px;color:var(--tx2);text-align:right;line-height:1.7}',
    '.fc{background:var(--sf);border-radius:22px;padding:4px 14px;box-shadow:var(--sh)}',
    '.fcr{display:flex;align-items:center;height:47px}',
    '.fcr+.fcr{border-top:1px solid var(--track)}',
    '.fcr-d{width:120px;font-size:15px;font-weight:500}',
    '.fcr ha-icon{--mdc-icon-size:26px}',
    '.fcr-p{width:64px;font-size:12px;color:#38bdf8;margin-left:8px}',
    '.fcr-t{margin-left:auto;font-size:16px;font-weight:600}',
    '.fcr-t span{color:var(--tx3);font-weight:500;margin-left:8px}',
    /* solar flow */
    '.flow{position:relative;width:456px;height:280px;margin-left:auto;margin-right:auto;background:var(--sf);border-radius:24px;box-shadow:var(--sh)}',
    '.flow svg{position:absolute;top:0;left:0}',
    '.fn{position:absolute;width:88px;height:88px;border-radius:50%;background:var(--sf2);border:3px solid var(--c);',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}',
    '.fn.idle{border-color:var(--track)}',
    '.fn ha-icon{color:var(--c);--mdc-icon-size:22px}',
    '.fn-v{font-size:15px;font-weight:700;margin-top:1px;white-space:nowrap}',
    '.fn-l{font-size:10.5px;color:var(--tx2);white-space:nowrap}',
    '.inv{position:absolute;width:50px;height:50px;border-radius:50%;background:var(--sf3);display:flex;align-items:center;justify-content:center;color:var(--accent)}',
    /* phone layout */
    '.dev-phone .page{padding:14px 14px 22px}',
    '.dev-phone .time{font-size:66px;letter-spacing:-2px}',
    '.dev-phone .h-mid{height:auto;min-height:84px}',
    '.dev-phone .wx{max-width:190px;padding:8px 12px 8px 8px}',
    '.dev-phone .wx-ic{--mdc-icon-size:40px}',
    '.dev-phone .wx-t{font-size:26px}',
    '.dev-phone .tiles{flex:none;grid-auto-rows:148px}',
    '.dev-phone .ctl{flex-direction:column}',
    '.dev-phone .ctl .ring-w{display:flex;justify-content:center}',
    '.dev-phone .col{margin-left:0;margin-top:10px}',
    '.dev-phone .col .stp{flex:none}',
    '.dev-phone .stats{grid-template-columns:repeat(2,1fr)}',
    '.dev-phone .kpis{grid-template-columns:repeat(2,1fr)}',
    '.dev-phone .hero{flex:none}',
    '.dev-phone .sh-g.c3,.dev-phone .sh-g.c4{grid-template-columns:repeat(2,1fr)}',
    '.dev-phone .flow{zoom:var(--fz,1)}',
    '.dev-phone .sw{grid-template-columns:repeat(4,1fr);grid-row-gap:10px;row-gap:10px}',
    '.dev-phone .seg.n5,.dev-phone .seg.n6{grid-template-columns:repeat(3,1fr)}',
    /* overlay sheet + toast */
    '.ov{position:absolute;top:0;left:0;right:0;bottom:0;background:var(--ov);display:flex;align-items:flex-end;z-index:10;animation:fo .15s}',
    '.sheet{width:100%;background:var(--sf);border-radius:24px 24px 0 0;padding:14px 14px 18px;animation:up .2s ease-out;max-height:92%;overflow:auto}',
    '.sh-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.sh-t{font-size:17px;font-weight:600;padding-left:4px}',
    '.sh-g{display:grid;grid-template-columns:repeat(3,1fr);grid-gap:8px;gap:8px}',
    '.sh-g.c2{grid-template-columns:repeat(2,1fr)}.sh-g.c4{grid-template-columns:repeat(4,1fr)}',
    '.sh-s+.sh-s{margin-top:14px}',
    '.sh-st{display:flex;align-items:center;font-size:13px;font-weight:600;color:var(--tx2);margin:0 0 8px 2px}',
    '.sh-st ha-icon{--mdc-icon-size:17px;margin-right:6px}',
    '.sh-o{height:50px;border-radius:14px;background:var(--sf3);font-size:13.5px;text-align:center;padding:0 8px;display:flex;align-items:center;justify-content:center;min-width:0}',
    '.sh-o ha-icon{--mdc-icon-size:20px;margin-right:7px}',
    '.sh-o span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sh-i{display:flex;align-items:center;background:var(--sf2);border-radius:12px;padding:9px 10px;font-size:13px;min-width:0}',
    '.sh-i ha-icon{--mdc-icon-size:16px;color:var(--tx2);margin-right:6px}',
    '.sh-il{color:var(--tx2);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sh-iv{font-weight:600;margin-left:6px;white-space:nowrap}.sh-iv small{color:var(--tx2);font-weight:500}',
    '.sh-o.on{background:var(--accent);color:#fff}',
    '.toast{position:absolute;left:12px;right:12px;bottom:12px;background:#ef4444;color:#fff;border-radius:14px;padding:10px 14px;font-size:13px;z-index:20;animation:fo .2s}',
    '.na{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--tx2);text-align:center}',
    '.na ha-icon{--mdc-icon-size:48px;margin-bottom:8px;color:var(--tx3)}',
    '.ss{position:absolute;top:0;left:0;right:0;bottom:0;background:#000;color:#e9ecf1;z-index:50;display:flex;align-items:center;justify-content:center;animation:fo 1.2s ease}',
    '.ss-in{text-align:center;transition:transform 3s ease}',
    '.ss-t{font-size:156px;font-weight:200;letter-spacing:-6px;line-height:1;font-variant-numeric:tabular-nums}',
    '.ss-d{font-size:22px;color:#8a93a3;margin-top:10px}',
    '.ss-w{display:flex;align-items:center;justify-content:center;margin-top:26px;font-size:30px;color:#cfd4dc}',
    '.ss-w ha-icon{--mdc-icon-size:38px;margin-right:10px}.ss-w small{font-size:17px;color:#7d8696;margin-left:12px}',
    '.ss.ph .ss-t{font-size:104px;letter-spacing:-4px}'
  ].join('\n');

  /* ==================================================================== card */
  class NSPanelProCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._page = 'home';
      this._acIdx = 0;
      this._pending = {};
      this._timers = {};
      this._local = {};
      this._sheet = null;
      this._lastTouch = Date.now();
      this._sig = '';
      this._forecast = null;
      this._fitKey = '';
      this._minuteKey = '';
    }

    static getConfigElement() {
      return document.createElement(EDITOR);
    }

    static getStubConfig(hass) {
      var ids = hass ? Object.keys(hass.states) : [];
      var weather = ids.filter(function (e) { return e.indexOf('weather.') === 0; })[0];
      var climates = ids.filter(function (e) { return e.indexOf('climate.') === 0; }).slice(0, 4);
      return {
        device: 'nspanel',
        weather: weather || '',
        recuperator: { enabled: false },
        air_conditioner: { enabled: climates.length > 0, entities: climates },
        heat_pump: { enabled: false },
        solar: { enabled: false }
      };
    }

    setConfig(config) {
      if (!config || typeof config !== 'object') throw new Error(CARD + ': invalid configuration');
      this._config = config;
      this._c = normConfig(config);
      var watch = collectEntities(config, {});
      this._c._acs.forEach(function (a) {
        var obj = a.entity.split('.')[1];
        AC_SWITCHES.forEach(function (sw) { watch['switch.' + obj + '_' + sw[0]] = 1; });
      });
      watch['sun.sun'] = 1;
      this._watch = Object.keys(watch);
      this._sig = '';
      this._fitKey = '';
      if (['home', 'menu', 'weather', 'rec', 'ac', 'hp', 'solar'].indexOf(this._page) < 0) this._page = 'home';
      if (this._hass && this._pageEl) this._render(true);
    }

    getCardSize() { return 12; }
    getGridOptions() { return { columns: 'full', min_rows: 8 }; }

    set hass(hass) {
      var first = !this._hass;
      this._hass = hass;
      if (!this._pageEl) this._build();
      if (first) this._subscribeForecast();
      var sig = this._signature();
      if (sig !== this._sig) { this._sig = sig; this._render(); }
      this._checkWake();
    }
    get hass() { return this._hass; }

    connectedCallback() {
      var self = this;
      if (!this._pageEl) this._build();
      clearInterval(this._tick);
      this._tick = setInterval(function () { self._onTick(); }, 1000);
      this._onResize = function () { self._fit(); };
      window.addEventListener('resize', this._onResize);
      this._onVis = function () { if (document.visibilityState === 'visible' && self._ssOn) self._wake(); };
      document.addEventListener('visibilitychange', this._onVis);
      if (this._hass && this._c) {
        this._subscribeForecast();
        this._render(true);
      }
      setTimeout(function () { self._fit(); }, 50);
    }

    disconnectedCallback() {
      clearInterval(this._tick);
      window.removeEventListener('resize', this._onResize);
      document.removeEventListener('visibilitychange', this._onVis);
      this._unsubForecast();
    }

    /* ------------------------------------------------------- infrastructure */
    _build() {
      var self = this;
      this.shadowRoot.innerHTML = '<style>' + STYLE + '</style>' +
        '<div class="screen t-dark" id="screen"><div class="page" id="page"></div><div id="ovl"></div><div id="ss"></div></div>';
      this._screen = this.shadowRoot.getElementById('screen');
      this._pageEl = this.shadowRoot.getElementById('page');
      this._ovlEl = this.shadowRoot.getElementById('ovl');
      this._ssEl = this.shadowRoot.getElementById('ss');
      this._ssEl.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); self._wake(); });
      this._ssEl.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
      this.shadowRoot.addEventListener('click', function (e) { self._onClick(e); });
      this.shadowRoot.addEventListener('pointerdown', function () { self._lastTouch = Date.now(); }, { passive: true });
      this.shadowRoot.addEventListener('touchstart', function () { self._lastTouch = Date.now(); }, { passive: true });
    }

    _signature() {
      var st = this._hass.states, out = [], w = this._watch || [];
      for (var i = 0; i < w.length; i++) {
        var s = st[w[i]];
        out.push(s ? s.last_updated + s.state : '-');
      }
      return out.join('|');
    }

    _fit() {
      if (!this._screen || !this.isConnected || !this._c) return;
      var rect = this.getBoundingClientRect();
      var w = rect.width || this.offsetWidth;
      if (!w) return;
      var phone = this._c.device === 'phone';
      var h;
      if (this._c.height) h = Number(this._c.height);
      else if (this.preview || this.editMode) h = phone ? 720 : Math.min(w, 520);
      else h = window.innerHeight - Math.max(0, rect.top);
      h = Math.max(h, 300);
      var z, lw, lh;
      if (phone) {
        z = 1; lw = Math.min(w, 620); lh = h;
      } else {
        var base = 480;
        z = clamp(Math.min(w, h) / base, 0.4, 3);
        lw = Math.min(w / z, base * 1.4); lh = h / z;
      }
      var key = [w, h, z, phone].join('x');
      if (key === this._fitKey) return;
      this._fitKey = key;
      this.style.height = h + 'px';
      this._screen.style.zoom = z;
      this._screen.style.width = lw + 'px';
      this._screen.style.height = lh + 'px';
      this._screen.style.setProperty('--fz', Math.min(1, (lw - 28) / 456).toFixed(3));
    }

    _onTick() {
      var now = new Date();
      var key = now.getHours() + ':' + now.getMinutes();
      if (key !== this._minuteKey) { this._minuteKey = key; this._render(); if (this._ssOn) this._renderSs(); }
      if (!this._ssOn && this._ssActive() && Date.now() - this._lastTouch > this._ssTimeout() * 1000) this._sleep();
      var to = this._c ? Number(this._c.home_timeout) : 0;
      if (to > 0 && (this._page !== 'home' || this._sheet) && Date.now() - this._lastTouch > to * 1000) {
        this._page = 'home';
        this._sheet = null;
        this._render(true);
      }
      this._fit();
    }

    /* ---------------------------------------------------------- screensaver */
    _ssActive() {
      var ss = this._c && this._c._ss;
      if (!ss || !this._hass) return false;
      if (ss.enabled_entity) {
        var e = this._st(ss.enabled_entity);
        if (e && e.state === 'off') return false;
      }
      var users = ss.users;
      if (typeof users === 'string') users = users.split(',');
      if (users && users.length) {
        var me = ((this._hass.user && this._hass.user.name) || '').toLowerCase();
        var ok = users.some(function (u) { return String(u).trim().toLowerCase() === me; });
        if (!ok) return false;
      }
      return !(this.preview || this.editMode);
    }
    _ssTimeout() {
      var ss = this._c._ss, v = NaN;
      if (ss.timeout_entity) v = this._n(ss.timeout_entity);
      if (isNaN(v)) v = Number(ss.timeout);
      return isNaN(v) || v < 5 ? 60 : v;
    }
    _sleep() {
      this._ssOn = true;
      this._sheet = null;
      this._page = 'home';
      this._render(true);
      this._renderSs();
      var ss = this._c._ss;
      if (ss.on_start) this._runEntity(ss.on_start);
    }
    _wake() {
      this._lastTouch = Date.now();
      if (!this._ssOn) return;
      this._ssOn = false;
      if (this._ssEl) { this._ssEl.className = ''; this._ssEl.innerHTML = ''; }
      var ss = this._c && this._c._ss;
      if (ss && ss.on_wake) this._runEntity(ss.on_wake);
    }
    _runEntity(eid) {
      var dom = eid.split('.')[0];
      if (dom === 'script') this._call('script', 'turn_on', { entity_id: eid });
      else if (dom === 'scene') this._call('scene', 'turn_on', { entity_id: eid });
      else if (dom === 'automation') this._call('automation', 'trigger', { entity_id: eid });
      else this._press(eid);
    }
    _checkWake() {
      var ss = this._c && this._c._ss;
      if (!ss || !this._hass) return;
      var list = ss.wake_entities || (ss.wake_entity ? [ss.wake_entity] : []);
      if (typeof list === 'string') list = [list];
      var self = this, sig = [], wakeNow = false;
      list.forEach(function (eid) {
        var st = self._st(eid);
        var k = st ? st.last_changed + st.state : '-';
        sig.push(k);
        var prev = self._wakeSig && self._wakeSig[eid];
        if (prev !== undefined && prev !== k && st && ['off', 'unavailable', 'unknown', 'far', 'idle', 'clear', 'not_home'].indexOf(st.state) < 0) wakeNow = true;
      });
      this._wakeSig = {};
      list.forEach(function (eid, i) { self._wakeSig[eid] = sig[i]; });
      if (wakeNow) {
        if (this._ssOn) this._wake();
        else this._lastTouch = Date.now();
      }
    }
    _renderSs() {
      if (!this._ssEl || !this._ssOn) return;
      this._curLang = this._lang();
      var now = new Date(), self = this;
      var time = pad(now.getHours()) + ':' + pad(now.getMinutes());
      var date;
      try { date = cap(new Intl.DateTimeFormat(this._locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(now)); } catch (e) { date = now.toDateString(); }
      var wx = '';
      var w = this._st(this._c.weather);
      if (w && this._c._ss.show_weather !== false) {
        wx = '<div class="ss-w">' + ic(WX_ICON[w.state] || 'mdi:weather-cloudy', '', 'color:' + (WX_COLOR[w.state] || '#94a3b8')) +
          '<span>' + this._num(parseFloat(w.attributes.temperature), 1) + '°</span><small>' + esc((this.t('w') || {})[w.state] || w.state) + '</small></div>';
      }
      /* move the content a little every minute to protect the display */
      var m = now.getMinutes() % 6, dx = [0, 18, -14, 10, -18, 6][m], dy = [0, -12, 14, 8, -6, -16][m];
      this._ssEl.className = 'ss' + (this._c.device === 'phone' ? ' ph' : '');
      morphHTML(this._ssEl, '<div class="ss-in" style="transform:translate(' + dx + 'px,' + dy + 'px)">' +
        '<div class="ss-t">' + time + '</div><div class="ss-d">' + esc(date) + '</div>' + wx + '</div>');
      void self;
    }

    _subscribeForecast() {
      var self = this;
      if (this._fcSub || !this._hass || !this._c || !this._c.weather || !this.isConnected) return;
      var ws = this._st(this._c.weather);
      if (!ws) return;
      var sf = ws.attributes.supported_features || 0;
      var type = (sf & 1) ? 'daily' : (sf & 4) ? 'twice_daily' : (sf & 2) ? 'hourly' : 'daily';
      try {
        this._fcSub = this._hass.connection.subscribeMessage(function (m) {
          self._forecast = m.forecast || null;
          self._render();
        }, { type: 'weather/subscribe_forecast', entity_id: this._c.weather, forecast_type: type });
        this._fcSub.catch(function () { self._fcSub = null; });
      } catch (e) { this._fcSub = null; }
    }

    _unsubForecast() {
      if (this._fcSub) {
        this._fcSub.then(function (u) { if (u) u(); }).catch(function () {});
        this._fcSub = null;
      }
    }

    /* ---------------------------------------------------------- state utils */
    _st(eid) { return eid && this._hass ? this._hass.states[eid] : undefined; }
    _ok(s) { return !!s && s.state !== 'unavailable' && s.state !== 'unknown'; }
    _n(eid, d) {
      var s = this._st(eid);
      var v = s ? parseFloat(s.state) : NaN;
      return isNaN(v) ? (d === undefined ? NaN : d) : v;
    }
    _isOn(eid) { var s = this._st(eid); return !!s && s.state === 'on'; }

    _lang() {
      var l = this._setting('language');
      return T[l] ? l : 'en';
    }
    t(key) {
      var l = this._curLang || 'en';
      var v = T[l][key];
      if (v === undefined) v = T.en[key];
      return v === undefined ? key : v;
    }
    _locale() { return LOCALES[this._curLang] || 'en-GB'; }
    _num(v, dec) {
      if (v === null || v === undefined || isNaN(v)) return '—';
      var key = this._curLang + dec;
      this._nf = this._nf || {};
      if (!this._nf[key]) {
        try {
          this._nf[key] = new Intl.NumberFormat(this._locale(), { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: false });
        } catch (e) { this._nf[key] = { format: function (x) { return Number(x).toFixed(dec); } }; }
      }
      return this._nf[key].format(v);
    }
    _power(w) {
      if (w === null || isNaN(w)) return { v: '—', u: '' };
      if (Math.abs(w) >= 1000) return { v: this._num(w / 1000, Math.abs(w) >= 10000 ? 1 : 2), u: this.t('u_kw') };
      return { v: this._num(Math.round(w), 0), u: this.t('u_w') };
    }

    _setting(name) {
      var p = this._local[name];
      if (p && Date.now() - p.ts < 8000) return p.v;
      var eid = this._c[name + '_entity'];
      var s = this._st(eid);
      if (this._ok(s)) return s.state;
      try {
        var v = window.localStorage.getItem(CARD + '_' + name);
        if (v) return v;
      } catch (e) { /* storage unavailable */ }
      if (this._c[name]) return this._c[name];
      if (name === 'language') {
        var hl = (this._hass && this._hass.language) || 'en';
        return T[hl.slice(0, 2)] ? hl.slice(0, 2) : 'en';
      }
      return name === 'theme' ? 'dark' : 'blue';
    }

    _setSetting(name, v) {
      this._local[name] = { v: v, ts: Date.now() };
      try { window.localStorage.setItem(CARD + '_' + name, v); } catch (e) { /* storage unavailable */ }
      var eid = this._c[name + '_entity'];
      var s = this._st(eid);
      if (s) {
        var opts = s.attributes.options || [];
        if (opts.indexOf(v) >= 0) this._call('input_select', 'select_option', { entity_id: eid, option: v });
      }
      this._render(true);
    }

    _call(domain, service, data) {
      var self = this;
      if (!this._hass) return Promise.resolve();
      return this._hass.callService(domain, service, data).catch(function (e) {
        self._toast = { msg: (e && e.message) || String(e), ts: Date.now() };
        self._render();
        setTimeout(function () { self._render(); }, 4200);
      });
    }
    _press(eid) {
      var dom = eid.split('.')[0];
      if (dom === 'script') return this._call('script', 'turn_on', { entity_id: eid });
      if (dom === 'button' || dom === 'input_button') return this._call(dom, 'press', { entity_id: eid });
      return this._call('homeassistant', 'toggle', { entity_id: eid });
    }
    _setNumber(eid, v) {
      var dom = eid.split('.')[0];
      return this._call(dom === 'input_number' ? 'input_number' : 'number', 'set_value', { entity_id: eid, value: v });
    }
    _selectOption(eid, option) {
      var dom = eid.split('.')[0];
      return this._call(dom === 'input_select' ? 'input_select' : 'select', 'select_option', { entity_id: eid, option: option });
    }
    _moreInfo(eid) {
      this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: eid }, bubbles: true, composed: true }));
    }
    _navigate(path) {
      if (!path) return;
      window.history.pushState(null, '', path);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    }

    /* pending (optimistic) numeric values for +/- buttons */
    _pv(key, fallback) {
      var p = this._pending[key];
      if (p && Date.now() - p.ts < 6000) return p.v;
      return fallback;
    }
    _bump(key, cur, delta, min, max, step, send) {
      var self = this;
      if (isNaN(min)) min = -1000;
      if (isNaN(max)) max = 1000;
      var base = isNaN(cur) ? (delta > 0 ? min : max) : cur;
      var v = Math.round((base + delta) / step) * step;
      v = clamp(v, min, max);
      v = Math.round(v * 100) / 100;
      this._pending[key] = { v: v, ts: Date.now() };
      clearTimeout(this._timers[key]);
      this._timers[key] = setTimeout(function () {
        self._pending[key] = { v: v, ts: Date.now() };
        send(v);
      }, 650);
      this._render();
    }

    /* -------------------------------------------------------------- render */
    _render(full) {
      if (!this._hass || !this._pageEl || !this._c) return;
      this._fit();
      this._curLang = this._lang();
      var theme = this._setting('theme');
      if (theme === 'auto') {
        var sun = this._st('sun.sun');
        theme = sun && sun.state === 'below_horizon' ? 'dark' : 'light';
      }
      if (theme !== 'light') theme = 'dark';
      var accName = this._setting('accent');
      var acc = ACCENTS[accName] || (/^#[0-9a-f]{3,6}$/i.test(accName) ? accName : ACCENTS.blue);
      this._screen.className = 'screen t-' + theme + ' dev-' + this._c.device;
      this._screen.style.setProperty('--accent', acc);
      this._screen.style.setProperty('--acc-rgb', hexRgb(acc));

      var html;
      try {
        var fn = this['_p_' + this._page];
        html = fn ? fn.call(this) : this._p_home();
      } catch (e) {
        html = '<div class="na">' + ic('mdi:alert-circle-outline') + '<div>' + esc(e && e.message) + '</div></div>';
        if (window.console) console.error(CARD, e);
      }
      var pageKey = this._page + '|' + this._curLang + '|' + this._c.device;
      if (full || pageKey !== this._renderedKey) {
        var anim = this._renderedKey && this._renderedKey.split('|')[0] !== this._page;
        this._pageEl.innerHTML = html;
        this._pageEl.className = 'page p-' + this._page + (anim ? ' enter' : '');
        this._pageEl.scrollTop = 0;
        this._renderedKey = pageKey;
      } else {
        morphHTML(this._pageEl, html);
      }
      var ov = '';
      if (this._sheet) ov += this._sheetHtml();
      if (this._toast && Date.now() - this._toast.ts < 4000) ov += '<div class="toast">' + esc(this._toast.msg) + '</div>';
      morphHTML(this._ovlEl, ov);
    }

    /* --------------------------------------------------------- UI pieces */
    _hdr(title, sub, opt) {
      opt = opt || {};
      return '<div class="hdr">' +
        '<button class="ib" data-a="home">' + ic('mdi:chevron-left') + '</button>' +
        '<div class="hdr-t"><div class="ttl">' + esc(title) + '</div>' +
        (sub ? '<div class="sub' + (opt.subErr ? ' err' : '') + '">' + esc(sub) + '</div>' : '') + '</div>' +
        (opt.extra || '') +
        (opt.power ? '<button class="pwr' + (opt.power.on ? ' on' : '') + (opt.power.dis ? ' dis' : '') + '" data-a="' + opt.power.a + '">' + ic('mdi:power') + '</button>' : '') +
        '</div>';
    }

    _ring(size, frac, color, center, opt) {
      opt = opt || {};
      var sw = opt.stroke || 12, cx = size / 2;
      var rot = 'rotate(135 ' + cx + ' ' + cx + ')';
      var arcs = opt.arcs || [{ frac: frac, color: color }];
      var svg = '';
      arcs.forEach(function (a, k) {
        var r = (size - sw) / 2 - 2 - k * (sw + 7), c = 2 * Math.PI * r, arc = c * 0.75;
        var f = isNaN(a.frac) ? 0 : clamp(a.frac, 0, 1);
        var fill = Math.max(0.0001, arc * f);
        svg += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="var(--track)" stroke-width="' + sw + '" stroke-linecap="round" ' +
          'style="stroke-dasharray:' + arc.toFixed(1) + ' ' + c.toFixed(1) + '" transform="' + rot + '"></circle>' +
          '<circle class="arc" cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + a.color + '" stroke-width="' + sw + '" stroke-linecap="round" ' +
          'style="stroke-dasharray:' + fill.toFixed(1) + ' ' + c.toFixed(1) + ';opacity:' + (f > 0 ? 1 : 0) + '" transform="' + rot + '"></circle>';
      });
      return '<div class="ring-w' + (opt.solo ? ' solo' : '') + '" style="--rc:' + color + '">' + (opt.left || '') +
        '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + svg + '</svg>' +
        (opt.right || '') + '<div class="ring-c">' + center + '</div></div>';
    }

    _stepper(label, icon, valueHtml, action, key, opt) {
      opt = opt || {};
      var dis = opt.disabled ? ' dis' : '';
      return '<div class="stp' + (opt.small ? ' sm' : '') + '">' +
        '<div class="stp-l">' + (icon ? ic(icon) : '') + esc(label) + '</div>' +
        '<div class="stp-r">' +
        '<button class="stp-b' + dis + '" data-a="' + action + '" data-k2="' + key + '" data-d="-1">' + ic('mdi:minus') + '</button>' +
        '<div class="stp-v">' + valueHtml + '</div>' +
        '<button class="stp-b' + dis + '" data-a="' + action + '" data-k2="' + key + '" data-d="1">' + ic('mdi:plus') + '</button>' +
        '</div>' + (opt.note ? '<div class="note">' + esc(opt.note) + '</div>' : '') + '</div>';
    }

    _stat(icon, label, value, unit, opt) {
      opt = opt || {};
      var tag = opt.a ? 'button' : 'div';
      return '<' + tag + ' class="st' + (opt.on ? ' on' : '') + (opt.warn ? ' warn' : '') + '"' +
        (opt.a ? ' data-a="' + opt.a + '"' + (opt.e ? ' data-e="' + opt.e + '"' : '') : '') + '>' +
        '<div class="st-h">' + ic(icon) + '<span>' + esc(label) + '</span></div>' +
        '<div class="st-v">' + value + (unit ? '<small>' + esc(unit) + '</small>' : '') + '</div></' + tag + '>';
    }
    _stats(list) {
      if (!list.length) return '';
      return '<div class="stats">' + list.slice(0, 8).join('') + '</div>';
    }

    _sb(icon, label, on, a, data, cls) {
      var attrs = '';
      Object.keys(data || {}).forEach(function (k) { attrs += ' data-' + k + '="' + esc(data[k]) + '"'; });
      return '<button class="sb' + (cls ? ' ' + cls : '') + (on ? ' on' : '') + '" data-a="' + a + '"' + attrs + '>' +
        (icon ? ic(icon) : '') + '<span>' + esc(label) + '</span></button>';
    }
    _seg(items) {
      if (!items.length) return '';
      return '<div class="seg n' + clamp(items.length, 1, 6) + '">' + items.join('') + '</div>';
    }

    _sheetHtml() {
      var s = this._sheet, fn = s && this['_sh_' + s.kind];
      var body = fn ? fn.call(this) : null;
      if (!body) return '';
      return '<div class="ov" data-a="sheet_close"><div class="sheet" data-a="noop">' +
        '<div class="sh-h"><div class="sh-t">' + esc(body.title) + '</div>' +
        '<button class="ib" data-a="sheet_close">' + ic('mdi:close') + '</button></div>' +
        body.sections.filter(Boolean).join('') + '</div></div>';
    }
    _shSec(title, icon, items, cols) {
      if (!items.length) return '';
      return '<div class="sh-s"><div class="sh-st">' + (icon ? ic(icon) : '') + esc(title) + '</div>' +
        '<div class="sh-g c' + (cols || 3) + '">' + items.join('') + '</div></div>';
    }
    _shOpt(icon, label, on, a, data, dis) {
      var attrs = '';
      Object.keys(data || {}).forEach(function (k) { attrs += ' data-' + k + '="' + esc(data[k]) + '"'; });
      return '<button class="sh-o' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-a="' + a + '"' + attrs + '>' +
        (icon ? ic(icon) : '') + '<span>' + esc(label) + '</span></button>';
    }
    _shInfo(icon, label, value, unit) {
      return '<div class="sh-i">' + ic(icon) + '<span class="sh-il">' + esc(label) + '</span><span class="sh-iv">' + value +
        (unit ? '<small> ' + esc(unit) + '</small>' : '') + '</span></div>';
    }
    _mbtn(kind, icon, value, sub, color, dis, small) {
      return '<button class="mbtn' + (small ? ' sm' : '') + (dis ? ' dis' : '') + '" data-a="sheet" data-v="' + kind + '">' +
        '<div class="mb-ic"' + (color ? ' style="background:' + color + '"' : '') + '>' + ic(icon) + '</div>' +
        '<div class="mb-t"><div class="mb-v">' + esc(value) + '</div>' + (sub ? '<div class="mb-s">' + esc(sub) + '</div>' : '') + '</div>' +
        '<div class="mb-more">' + ic('mdi:chevron-up') + '</div></button>';
    }
    _kpi(icon, label, value, unit, opt) {
      opt = opt || {};
      return '<div class="kpi' + (opt.warn ? ' warn' : '') + '"><div class="kpi-l">' + ic(icon) + '<span>' + esc(label) + '</span></div>' +
        '<div class="kpi-v">' + value + (unit ? '<small>' + esc(unit) + '</small>' : '') + '</div></div>';
    }
    _kpis(list) {
      if (!list.length) return '';
      list = list.slice(0, 4);
      return '<div class="kpis n' + list.length + '">' + list.join('') + '</div>';
    }

    /* ================================================================ HOME */
    _p_home() {
      var c = this._c;
      var now = new Date();
      var time = pad(now.getHours()) + ':' + pad(now.getMinutes());
      var date;
      try {
        date = cap(new Intl.DateTimeFormat(this._locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(now));
      } catch (e) { date = now.toDateString(); }

      var tiles = [];
      if (c._rec) tiles.push(this._tileRec());
      if (c._acs.length) tiles.push(this._tileAc());
      if (c._hp) tiles.push(this._tileHp());
      if (c._solar) tiles.push(this._tileSolar());
      var self = this;
      c._buttons.forEach(function (b, i) { tiles.push(self._tileBtn(b, i)); });

      return '<div class="h-top"><div class="date">' + esc(date) + '</div>' +
        (c.show_settings !== false ? '<button class="ib" data-a="nav" data-p="menu">' + ic('mdi:menu') + '</button>' : '') + '</div>' +
        '<div class="h-mid"><div class="time">' + time + '</div>' + this._wxBlock() + '</div>' +
        this._tilesHtml(tiles);
    }

    _tilesHtml(tiles) {
      var n = tiles.length;
      if (!n) return '<div class="empty">' + esc(this.t('empty')) + '</div>';
      var phone = this._c.device === 'phone';
      var cols = phone ? (n === 1 ? 1 : 2) : (n === 1 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4);
      var rows = Math.ceil(n / cols);
      var cls = '';
      if (!phone) cls = rows >= 3 && cols >= 3 ? ' xs' : (cols >= 3 || rows >= 3) ? ' cmp' : '';
      var span = cols - ((n - 1) % cols);
      var style = 'grid-template-columns:repeat(' + cols + ',minmax(0,1fr))' +
        (phone ? '' : ';grid-template-rows:repeat(' + rows + ',minmax(0,1fr))');
      return '<div class="tiles' + cls + '" style="' + style + '">' + tiles.map(function (t, i) {
        return i === n - 1 && span > 1 ? t.replace('<button class="tile', '<button style="grid-column:span ' + span + '" class="tile') : t;
      }).join('') + '</div>';
    }

    _wxBlock() {
      var w = this._st(this._c.weather);
      if (!w) return '';
      var cond = w.state;
      var temp = parseFloat(w.attributes.temperature);
      var hl = '';
      var f = this._forecast && this._forecast[0];
      if (f && f.temperature !== undefined) {
        hl = '↑' + this._num(f.temperature, 0) + '°' + (f.templow !== undefined && f.templow !== null ? '  ↓' + this._num(f.templow, 0) + '°' : '');
      }
      return '<button class="wx" data-a="nav" data-p="weather">' +
        ic(WX_ICON[cond] || 'mdi:weather-cloudy', 'wx-ic', 'color:' + (WX_COLOR[cond] || '#94a3b8')) +
        '<div><div class="wx-t">' + this._num(temp, 1) + '°</div>' +
        '<div class="wx-c">' + esc((this.t('w') || {})[cond] || cond) + '</div>' +
        (hl ? '<div class="wx-hl">' + hl + '</div>' : '') + '</div></button>';
    }

    _tile(action, icon, name, status, value, active, data) {
      var attrs = '';
      Object.keys(data || {}).forEach(function (k) { attrs += ' data-' + k + '="' + esc(data[k]) + '"'; });
      return '<button class="tile' + (active ? ' act' : '') + '" data-a="' + action + '"' + attrs + '>' +
        '<div class="t-row"><div class="t-ic">' + ic(icon) + '</div><div class="t-val">' + (value || '') + '</div></div>' +
        '<div class="t-name">' + esc(name) + '</div>' +
        '<div class="t-st">' + esc(status || '') + '</div></button>';
    }

    /* ===================================================== CUSTOM BUTTONS */
    _stateText(s) {
      if (!s) return '';
      if (s.state === 'on') return this.t('on');
      if (s.state === 'off') return this.t('off');
      if (s.state === 'unavailable') return this.t('unavailable');
      return s.state;
    }
    _tileBtn(b, i) {
      var s = b.entity ? this._st(b.entity) : null;
      var value = '', status = b.subtitle || '', active = false;
      if (s) {
        var v = parseFloat(s.state);
        if (!isNaN(v) && /^-?[\d.]+$/.test(s.state)) {
          var u = s.attributes.unit_of_measurement || '';
          var dec = Math.abs(v) >= 100 || v === Math.round(v) ? 0 : 1;
          value = this._num(v, dec) + (u ? '<small>' + esc(u) + '</small>' : '');
        } else {
          active = ON_STATES.indexOf(s.state) >= 0;
          if (!status) status = this._stateText(s);
        }
      }
      var icon = b.icon || (s && s.attributes.icon) || (b.url ? 'mdi:open-in-new' : b.navigation_path ? 'mdi:arrow-right-circle-outline' : 'mdi:gesture-tap-button');
      var name = b.name || (s && s.attributes.friendly_name) || b.navigation_path || b.url || '';
      return this._tile('cbtn', icon, name, status, value, active, { i: i });
    }
    _runButton(b) {
      var action = b.action || (b.navigation_path ? 'navigate' : b.url ? 'url' : b.entity ? 'more-info' : 'none');
      if (action === 'navigate') this._navigate(b.navigation_path);
      else if (action === 'url' && b.url) window.open(b.url, b.new_tab === false ? '_self' : '_blank');
      else if (action === 'more-info' && b.entity) this._moreInfo(b.entity);
      else if (action === 'toggle' && b.entity) this._press(b.entity);
    }

    /* ======================================================== RECUPERATOR */
    _recModeKey(state) {
      if (!state) return null;
      var r = this._c._rec;
      for (var i = 0; i < REC_MODES.length; i++) {
        var k = REC_MODES[i][0];
        if (r['mode_' + k] && r['mode_' + k] === state) return k;
      }
      for (var j = 0; j < REC_MODES.length; j++) if (REC_MODES[j][1].test(state)) return REC_MODES[j][0];
      return null;
    }
    _recOption(key) {
      var r = this._c._rec;
      if (r['mode_' + key]) return r['mode_' + key];
      var s = this._st(r.mode);
      if (!s) return null;
      var opts = s.attributes.options || [];
      for (var i = 0; i < REC_MODES.length; i++) {
        if (REC_MODES[i][0] !== key) continue;
        for (var j = 0; j < opts.length; j++) if (REC_MODES[i][1].test(opts[j])) return opts[j];
      }
      return null;
    }
    _recInfo() {
      var r = this._c._rec;
      var pw = this._st(r.power);
      var on = pw ? pw.state === 'on' : true;
      var avail = pw ? this._ok(pw) : true;
      var ms = this._st(r.mode);
      var mode = ms ? this._recModeKey(ms.state) : null;
      var boostLeft = this._n(r.boost_remaining, 0);
      if (boostLeft > 0) mode = 'boost';
      if (mode === 'off') on = false;
      return { on: on && avail, avail: avail, mode: mode, airflow: this._n(r.airflow), boostLeft: boostLeft };
    }
    _recStatusText(raw) {
      if (/ожидан|stand-?by|gaidīš/i.test(raw)) return this.t('standby');
      var k = this._recModeKey(raw);
      if (k) return this.t('m_' + k);
      var m = /\(([^)]+)\)/.exec(raw);
      if (m && this._curLang !== 'ru') return m[1];
      return raw;
    }
    _tileRec() {
      var r = this._c._rec, i = this._recInfo();
      var st = !i.avail ? this.t('unavailable') : !i.on ? this.t('off') :
        (i.mode ? this.t('m_' + i.mode) : this.t('on')) + (isNaN(i.airflow) ? '' : ' · ' + this._num(i.airflow, 0) + '%');
      var t = this._n(r.indoor || r.extract);
      return this._tile('nav', 'mdi:hvac', r.name || this.t('recuperator'), st,
        isNaN(t) ? '' : this._num(t, 1) + '<small>°C</small>', i.on, { p: 'rec' });
    }
    _p_rec() {
      var r = this._c._rec;
      if (!r) return this._p_home();
      var i = this._recInfo(), self = this;
      var status = this._st(r.status);
      var errN = this._n(r.error_count, 0);
      var errS = this._st(r.error_text);
      var sub = errN > 0 ? '⚠ ' + this.t('errors') + ': ' + (this._ok(errS) ? errS.state : errN) :
        (status && this._ok(status) ? this._recStatusText(status.state) : (i.on ? this.t('on') : this.t('off')));
      var hdr = this._hdr(r.name || this.t('recuperator'), sub, {
        power: r.power ? { on: i.on, a: 'rec_power' } : null, subErr: errN > 0
      });

      /* top-left: airflow ring */
      var af = i.airflow;
      var spd = i.on && af > 0 ? (3.2 - 2.6 * clamp(af / 100, 0, 1)).toFixed(2) + 's' : '0s';
      var m3 = this._n(r.airflow_m3h);
      var pend = r.airflow_target ? this._pending[r.airflow_target] : null;
      var pendTxt = pend && Date.now() - pend.ts < 6000 ? '→ ' + this._num(pend.v, 0) + '%' : '';
      var center = ic('mdi:fan', 'ring-i' + (i.on && af > 0 ? ' spin' : ''), '--spd:' + spd) +
        '<div class="ring-v">' + this._num(af, 0) + '<small>%</small></div>' +
        (pendTxt ? '<div class="ring-m acc">' + pendTxt + '</div>' : isNaN(m3) ? '' : '<div class="ring-m">' + this._num(m3, 0) + ' m³/h</div>') +
        '<div class="ring-l">' + esc(this.t('flow_speed')) + '</div>';
      var hasAf = !!r.airflow_target;
      var left = '<div class="rcard">' + this._ring(hasAf ? 178 : 200, af / 100, i.on ? 'var(--accent)' : 'var(--tx3)', center, { stroke: 14 }) +
        (hasAf ? '<div class="rc-b"><button class="stp-b" data-a="rec_af" data-d="-1">' + ic('mdi:minus') + '</button>' +
          '<button class="stp-b" data-a="rec_af" data-d="1">' + ic('mdi:plus') + '</button></div>' : '') + '</div>';

      /* top-right: supply temperature + target temperature */
      var right = [];
      var supEid = r.supply || r.indoor || r.extract;
      if (supEid) {
        var outd = this._n(r.outdoor);
        right.push('<div class="vcard"><div class="vc-l">' + ic(r.supply ? 'mdi:arrow-collapse-right' : 'mdi:home-thermometer-outline') +
          esc(r.supply ? this.t('supply') : this.t('indoor')) + '</div>' +
          '<div class="vc-v">' + this._num(this._n(supEid), 1) + '<small>°C</small></div>' +
          (isNaN(outd) ? '' : '<div class="vc-n">' + esc(this.t('outdoor')) + ': ' + this._num(outd, 1) + '°C</div>') + '</div>');
      }
      if (r.target) {
        var ts = this._st(r.target);
        var tv = this._pv(r.target, this._n(r.target));
        right.push(this._stepper(this.t('target'), 'mdi:thermometer', this._num(tv, 1) + '<small>°C</small>', 'rec_t', 't',
          { small: true, disabled: !this._ok(ts) }));
      }

      /* bottom: operating mode / data */
      var btns = [];
      if (this._recModes().length || r.night_cooling) {
        var mtxt = i.on ? (i.mode ? this.t('m_' + i.mode) : this.t('on')) : this.t('off');
        if (i.mode === 'boost' && i.boostLeft > 0) mtxt += ' · ' + Math.ceil(i.boostLeft / 60) + ' min';
        btns.push(this._mbtn('rec_mode', REC_ICON[i.mode] || 'mdi:fan', mtxt, this.t('modes'), i.on ? '' : 'var(--sf3)', false, true));
      }
      var stats = this._recStats();
      if (stats.length) {
        var sm = stats.filter(function (x) { return x[0] !== supEid; }).slice(0, 2)
          .map(function (x) { return self._num(self._n(x[0]), x[3]) + (x[4] === '°C' ? '°' : ' ' + x[4]); }).join(' · ');
        btns.push(this._mbtn('rec_data', 'mdi:chart-box-outline', this.t('data_short'), sm, 'var(--sf3)', false, true));
      }
      return hdr + '<div class="ctl hero rec-q">' + left + (right.length ? '<div class="col">' + right.join('') + '</div>' : '') + '</div>' +
        (btns.length ? '<div class="seg n' + btns.length + ' rec-btns">' + btns.join('') + '</div>' : '');
    }
    _recModes() {
      var r = this._c._rec, self = this;
      return ['protection', 'economy', 'comfort', 'boost'].filter(function (m) {
        return m === 'boost' ? !!(r.boost_button || self._recOption('boost')) : !!self._recOption(m);
      });
    }
    _recStats() {
      var r = this._c._rec, out = [];
      var fd = this._n(r.filter_days);
      [[r.outdoor, 'mdi:home-thermometer-outline', this.t('outdoor'), 1, '°C'],
        [r.supply, 'mdi:arrow-collapse-right', this.t('supply'), 1, '°C'],
        [r.extract, 'mdi:arrow-expand-left', this.t('extract'), 1, '°C'],
        [r.exhaust, 'mdi:export', this.t('exhaust'), 1, '°C'],
        [r.efficiency, 'mdi:recycle', this.t('recovery'), 0, '%'],
        [r.airflow_m3h, 'mdi:weather-windy', this.t('airflow'), 0, 'm³/h'],
        [r.fan_rpm || r.fan_supply_rpm, 'mdi:fan', this.t('fans'), 0, this.t('u_rpm')],
        [r.filter_days, 'mdi:air-filter', this.t('filter'), 0, this.t('days'), { warn: fd >= 0 && fd < 10 }]
      ].forEach(function (x) { if (x[0]) out.push(x); });
      return out;
    }
    _sh_rec_mode() {
      var r = this._c._rec, i = this._recInfo(), self = this;
      if (!r) return null;
      var modes = this._recModes().map(function (m) {
        var lbl = self.t('m_' + m);
        if (m === 'boost' && i.boostLeft > 0) lbl += ' · ' + Math.ceil(i.boostLeft / 60) + ' min';
        return self._shOpt(REC_ICON[m], lbl, i.on && i.mode === m, 'rec_mode', { v: m, close: 1 });
      });
      var fn = r.night_cooling ? [this._shOpt('mdi:weather-night', this.t('night_cooling'), this._isOn(r.night_cooling), 'toggle', { e: r.night_cooling })] : [];
      return {
        title: this.t('modes'),
        sections: [this._shSec(this.t('modes'), 'mdi:tune-variant', modes, 2), this._shSec(this.t('functions'), 'mdi:toggle-switch-outline', fn, 2)]
      };
    }
    _sh_rec_data() {
      var r = this._c._rec, self = this;
      if (!r) return null;
      var data = this._recStats().map(function (x) { return self._shInfo(x[1], x[2], self._num(self._n(x[0]), x[3]), x[4]); });
      var errN = this._n(r.error_count, NaN), errS = this._st(r.error_text), st = this._st(r.status);
      var extra = [];
      if (this._ok(st)) extra.push(this._shInfo('mdi:information-outline', this.t('status'), esc(this._recStatusText(st.state)), ''));
      if (!isNaN(errN)) extra.push(this._shInfo('mdi:alert-circle-outline', this.t('errors'), errN > 0 && this._ok(errS) ? esc(errS.state) : this._num(errN, 0), ''));
      return {
        title: this.t('data_short'),
        sections: [this._shSec(this.t('data'), 'mdi:chart-box-outline', data, 2), this._shSec(this.t('status'), 'mdi:information-outline', extra, 1)]
      };
    }

    /* =============================================================== AC */
    _acState(a) {
      var s = this._st(a.entity);
      return { s: s, ok: this._ok(s), on: this._ok(s) && s.state !== 'off' };
    }
    _acName(a, i) {
      if (a.name) return a.name;
      var s = this._st(a.entity);
      var fn = s && s.attributes.friendly_name;
      if (fn && !/^[0-9a-f]{10,}$/i.test(fn)) return fn;
      return this._c._acs.length > 1 ? this.t('ac') + ' ' + (i + 1) : (this._c._acTitle || this.t('ac'));
    }
    _tileAc() {
      var self = this, acs = this._c._acs;
      var idx = -1;
      acs.forEach(function (a, i) { if (idx < 0 && self._acState(a).on) idx = i; });
      var anyOn = idx >= 0;
      if (idx < 0) idx = clamp(this._acIdx, 0, acs.length - 1);
      var a = acs[idx], st = this._acState(a);
      var onCount = acs.filter(function (x) { return self._acState(x).on; }).length;
      var status;
      if (!st.ok) status = this.t('unavailable');
      else if (!st.on) status = this.t('off');
      else status = this.t('hvac_' + st.s.state) + ' · ' + this._num(Number(st.s.attributes.temperature), 0) + '°';
      if (acs.length > 1 && anyOn) status = onCount + '/' + acs.length + ' · ' + status;
      var cur = st.s ? Number(st.s.attributes.current_temperature) : NaN;
      var title = this._c._acTitle || (acs.length === 1 ? this._acName(a, 0) : this.t('ac'));
      return this._tile('nav', 'mdi:air-conditioner', title, status, isNaN(cur) ? '' : this._num(cur, 0) + '<small>°C</small>', anyOn, { p: 'ac' });
    }
    _p_ac() {
      var self = this, acs = this._c._acs;
      if (!acs.length) return this._p_home();
      var idx = this._acIdx = clamp(this._acIdx, 0, acs.length - 1);
      var a = acs[idx], st = this._acState(a), s = st.s;
      var pills = '';
      if (acs.length > 1) {
        pills = '<div class="pills">' + acs.map(function (x, i) {
          var xs = self._acState(x);
          return '<button class="pill' + (i === idx ? ' on' : '') + '" data-a="ac_sel" data-i="' + i + '">' + esc(x.short || (i + 1)) +
            (xs.on ? '<span class="dot"></span>' : !xs.ok ? '<span class="dot na"></span>' : '') + '</button>';
        }).join('') + '</div>';
      }
      var sub = !st.ok ? this.t('unavailable') : st.on ? this.t('hvac_' + s.state) : this.t('off');
      var hdr = this._hdr(this._acName(a, idx), sub, { extra: pills, power: { on: st.on, a: 'ac_power', dis: !st.ok } });
      if (!s) return hdr + '<div class="na">' + ic('mdi:air-conditioner') + '<div>' + esc(a.entity) + '</div></div>';

      var at = s.attributes;
      var min = Number(at.min_temp) || 16, max = Number(at.max_temp) || 30;
      var tgt = this._pv(a.entity + ':t', Number(at.temperature));
      var cur = Number(at.current_temperature), hum = Number(at.current_humidity);
      var mcol = st.on ? (HVAC_COL[s.state] || 'var(--accent)') : 'var(--tx3)';
      var center = ic(HVAC_ICON[s.state] || 'mdi:air-conditioner', 'ring-i' + (st.on && s.state === 'fan_only' ? ' spin' : ''), '--spd:2s') +
        '<div class="ring-v">' + this._num(cur, 0) + '<small>°C</small></div>' +
        '<div class="ring-l">' + esc(this.t('room')) + (isNaN(hum) ? '' : ' · ' + this._num(hum, 0) + '%') + '</div>';
      var ring = this._ring(212, (tgt - min) / (max - min), mcol, center, { stroke: 14 });
      var stp = this._stepper(this.t('target'), 'mdi:thermometer', this._num(tgt, (Number(at.target_temp_step) || 1) < 1 ? 1 : 0) + '<small>°C</small>',
        'ac_t', 't', { disabled: !st.ok });

      var dis = !st.ok, btns = [];
      var msub = this.t('modes') + (at.preset_mode && at.preset_mode !== 'none' ? ' · ' + this._acOptLabel('preset', at.preset_mode) : '');
      btns.push(this._mbtn('ac_mode', st.on ? (HVAC_ICON[s.state] || 'mdi:air-conditioner') : 'mdi:power',
        st.on ? this.t('hvac_' + s.state) : this.t('off'), msub, st.on ? (HVAC_COL[s.state] || '') : 'var(--sf3)', dis, true));
      if (at.fan_modes && at.fan_modes.length) {
        btns.push(this._mbtn('ac_fan', 'mdi:fan', this._acOptLabel('fan', at.fan_mode), this.t('fan'), 'var(--sf3)', dis, true));
      }
      if (at.swing_modes && at.swing_modes.length) {
        btns.push(this._mbtn('ac_swing', 'mdi:arrow-oscillating', this._acOptLabel('swing', at.swing_mode), this.t('swing'), 'var(--sf3)', dis, true));
      }
      var sws = this._acSwitches(a);
      if (sws.length) {
        var onN = sws.filter(function (e) { return self._isOn(e); }).length;
        btns.push(this._mbtn('ac_fn', 'mdi:toggle-switch-outline', onN ? this.t('on') + ': ' + onN + '/' + sws.length : this.t('off'),
          this.t('functions'), onN ? '' : 'var(--sf3)', dis, true));
      }
      return hdr + '<div class="ctl hero">' + ring + '<div class="col">' + stp + '</div></div>' +
        '<div class="seg n2">' + btns.join('') + '</div>';
    }
    _acSwitches(a) {
      var self = this, obj = a.entity.split('.')[1];
      return (a.switches || AC_SWITCHES.map(function (x) { return 'switch.' + obj + '_' + x[0]; }))
        .filter(function (e) { return !!self._st(e); });
    }
    _acCur() {
      var a = this._c._acs[this._acIdx];
      if (!a) return null;
      var st = this._acState(a);
      return st.s ? { a: a, st: st, s: st.s, at: st.s.attributes } : null;
    }
    _acGroup(x, kind, icon, cols) {
      var self = this;
      return this._shSec(this.t(kind), icon, (x.at[kind + '_modes'] || []).map(function (o) {
        return self._shOpt(null, self._acOptLabel(kind, o), x.at[kind + '_mode'] === o, 'ac_set', { k: kind, v: o, close: 1 }, !x.st.ok);
      }), cols || 3);
    }
    _sh_ac_mode() {
      var x = this._acCur(), self = this;
      if (!x) return null;
      var modes = (x.at.hvac_modes || []).filter(function (m) { return m !== 'off'; }).map(function (m) {
        return self._shOpt(HVAC_ICON[m] || 'mdi:help', self.t('hvac_' + m), x.st.on && x.s.state === m, 'ac_mode', { v: m, close: 1 }, !x.st.ok);
      });
      return { title: this.t('modes'), sections: [this._shSec(this.t('modes'), 'mdi:tune-variant', modes, 3), this._acGroup(x, 'preset', 'mdi:star-four-points-outline')] };
    }
    _sh_ac_fan() {
      var x = this._acCur();
      return x ? { title: this.t('fan'), sections: [this._acGroup(x, 'fan', 'mdi:fan')] } : null;
    }
    _sh_ac_swing() {
      var x = this._acCur();
      return x ? { title: this.t('swing'), sections: [this._acGroup(x, 'swing', 'mdi:arrow-oscillating')] } : null;
    }
    _sh_ac_fn() {
      var x = this._acCur(), self = this;
      if (!x) return null;
      var sws = this._acSwitches(x.a).map(function (e) {
        var key = null, icon = 'mdi:toggle-switch-outline';
        AC_SWITCHES.forEach(function (y) { if (e.slice(-y[0].length) === y[0]) { key = y[0]; icon = y[1]; } });
        var es = self._st(e);
        return self._shOpt(icon, key ? self.t('x_' + key) : (es.attributes.friendly_name || e), es.state === 'on', 'toggle', { e: e }, !self._ok(es));
      });
      return { title: this.t('functions'), sections: [this._shSec(this.t('functions'), 'mdi:toggle-switch-outline', sws, 2)] };
    }
    _acOptLabel(kind, v) {
      if (v === undefined || v === null) return '—';
      var k = kind + '_' + v;
      var tr = this.t(k);
      return tr === k ? pretty(v) : tr;
    }

    /* ========================================================= HEAT PUMP */
    _hpModes() {
      var c = this._c._hp, s = this._st(c.mode);
      var opts = s && s.attributes.options ? s.attributes.options : [];
      var out = [];
      HP_MODES.forEach(function (m) {
        var opt = c['mode_' + m[0]];
        if (!opt) {
          for (var j = 0; j < opts.length; j++) { if (m[1].test(opts[j])) { opt = opts[j]; break; } }
        }
        if (opt && (!opts.length || opts.indexOf(opt) >= 0)) out.push({ key: m[0], option: opt, icon: m[2] });
      });
      return out;
    }
    _hpInfo() {
      var c = this._c._hp;
      var on = c.power ? this._isOn(c.power) : true;
      var ms = this._st(c.mode);
      var modes = this._hpModes();
      var mode = null;
      if (ms) modes.forEach(function (m) { if (m.option === ms.state) mode = m.key; });
      var hz = this._n(c.compressor, NaN);
      var status = null, raw = null;
      var ss = this._st(c.status);
      if (this._ok(ss)) {
        raw = ss.state;
        for (var i = 0; i < HP_STATUS.length; i++) if (HP_STATUS[i][1].test(raw)) { status = HP_STATUS[i][0]; break; }
      }
      if (!status && !raw) {
        status = !on ? 'off' : (isNaN(hz) || hz > 0) ? (mode === 'cool' ? 'cool' : mode === 'dhw' ? 'dhw' : 'heat') : 'idle';
      }
      return { on: on, mode: mode, status: status, raw: raw, hz: hz, modes: modes };
    }
    _targetVal(eid) {
      var s = this._st(eid);
      if (!s) return NaN;
      var dom = eid.split('.')[0];
      if (dom === 'water_heater' || dom === 'climate') return Number(s.attributes.temperature);
      return parseFloat(s.state);
    }
    _outdoor() {
      var c = this._c._hp || {};
      if (c.outdoor) return this._n(c.outdoor);
      var w = this._st(this._c.weather);
      return w ? parseFloat(w.attributes.temperature) : NaN;
    }
    _tileHp() {
      var c = this._c._hp, i = this._hpInfo();
      var st = i.status ? this.t('st_' + i.status) : i.raw;
      if (i.on && c.cop && !isNaN(this._n(c.cop))) st += ' · ' + this.t('cop') + ' ' + this._num(this._n(c.cop), 1);
      var wv = this._n(c.water_out);
      return this._tile('nav', 'mdi:heat-pump-outline', c.name || this.t('heatpump'), st,
        isNaN(wv) ? '' : this._num(wv, 1) + '<small>°C</small>', i.on, { p: 'hp' });
    }
    _p_hp() {
      var c = this._c._hp, self = this;
      if (!c) return this._p_home();
      var i = this._hpInfo();
      var stTxt = i.status ? this.t('st_' + i.status) : i.raw;
      var hdr = this._hdr(c.name || this.t('heatpump'), stTxt, { power: c.power ? { on: i.on, a: 'hp_power' } : null });
      var scol = { heat: COL.heat, cool: COL.cool, dhw: COL.dhw, idle: 'var(--tx3)', off: 'var(--tx3)' }[i.status] || 'var(--accent)';
      var sicon = { heat: 'mdi:fire', cool: 'mdi:snowflake', dhw: 'mdi:water-boiler', idle: 'mdi:pause-circle-outline', off: 'mdi:power' }[i.status] || 'mdi:heat-pump-outline';
      var wout = this._n(c.water_out);
      var tank = c.dhw_tank ? this._n(c.dhw_tank) : NaN;
      var fcol = i.status === 'cool' ? COL.cool : i.on ? COL.heat : 'var(--tx3)';
      var tcol = c.dhw_tank ? (i.on ? COL.tank : 'var(--tx3)') : null;
      var center;
      if (c.dhw_tank) {
        center = ic(sicon, 'ring-i sm' + (i.status === 'heat' || i.status === 'dhw' || i.status === 'cool' ? ' pulse' : ''), 'color:' + scol) +
          '<div class="r2-v" style="color:' + fcol + '">' + this._num(wout, 1) + '<small>°</small></div>' +
          '<div class="r2-l">' + esc(this.t('flow')) + '</div>' +
          '<div class="r2-v b" style="color:' + tcol + '">' + this._num(tank, 1) + '<small>°</small></div>' +
          '<div class="r2-l">' + esc(this.t('boiler')) + '</div>';
      } else {
        center = ic(sicon, 'ring-i' + (i.status === 'heat' || i.status === 'dhw' || i.status === 'cool' ? ' pulse' : '')) +
          '<div class="ring-v">' + this._num(wout, 1) + '<small>°</small></div>' +
          '<div class="ring-l">' + esc(this.t('flow')) + '</div>';
      }

      var wc = c.weather_comp ? this._isOn(c.weather_comp) : false;
      var steppers = [];
      if (c.water_target) {
        var wt = this._pv(c.water_target, this._targetVal(c.water_target));
        steppers.push(this._stepper(i.mode === 'cool' ? this.t('hp_cool') : this.t('hp_heat'), i.mode === 'cool' ? 'mdi:snowflake' : 'mdi:radiator',
          this._num(wt, 1) + '<small>°C</small>', 'hp_t', 'w', { small: true, note: wc ? this.t('curve') : '' }));
      }
      if (c.dhw_target) {
        var dt = this._pv(c.dhw_target, this._targetVal(c.dhw_target));
        steppers.push(this._stepper(this.t('dhw'), 'mdi:water-boiler', this._num(dt, 0) + '<small>°C</small>', 'hp_t', 'd', { small: true }));
      }
      var ringOpt = { stroke: c.dhw_tank ? 12 : 14, solo: !steppers.length };
      if (c.dhw_tank) ringOpt.arcs = [{ frac: (wout - 10) / 50, color: fcol }, { frac: (tank - 10) / 60, color: tcol }];
      var ring = this._ring(steppers.length ? 200 : 232, (wout - 10) / 50, scol, center, ringOpt);

      var mb = '';
      if (i.modes.length || c.quiet || c.weather_comp || c.dhw_boost) {
        var cm = null;
        i.modes.forEach(function (m) { if (m.key === i.mode) cm = m; });
        var subs = [this.t('mode_lbl')];
        [[c.quiet, 'quiet'], [c.weather_comp, 'weather_comp'], [c.dhw_boost, 'dhw_boost']].forEach(function (x) {
          if (x[0] && self._isOn(x[0])) subs.push(self.t(x[1]));
        });
        mb = this._mbtn('hp', cm ? cm.icon : 'mdi:heat-pump-outline', !i.on ? this.t('off') : cm ? this.t('hp_' + cm.key) : stTxt,
          subs.join(' · '), i.on ? '' : 'var(--sf3)');
      }
      var kp = this._kpis(this._hpStats().filter(function (x) { return !(c.dhw_tank && x[4] === 'tank'); })
        .map(function (x) { return self._kpi(x[0], x[1], x[2], x[3]); }));
      return hdr + '<div class="ctl hero">' + ring + (steppers.length ? '<div class="col">' + steppers.join('') + '</div>' : '') + '</div>' + mb + kp;
    }
    _hpStats() {
      var c = this._c._hp, i = this._hpInfo(), out = [];
      var pkw = toKw(this._st(c.electric_power)), cop = this._n(c.cop), o = this._outdoor();
      if (!isNaN(o)) out.push(['mdi:home-thermometer-outline', this.t('outdoor'), this._num(o, 1), '°C']);
      if (c.dhw_tank) out.push(['mdi:water-thermometer', this.t('tank'), this._num(this._n(c.dhw_tank), 1), '°C', 'tank']);
      if (c.electric_power) out.push(['mdi:flash', this.t('power'), this._num(pkw, pkw < 10 ? 1 : 0), this.t('u_kw')]);
      if (c.cop) out.push(['mdi:gauge', this.t('cop'), this._num(cop, 1), '']);
      if (c.water_in) out.push(['mdi:thermometer-chevron-down', this.t('ret'), this._num(this._n(c.water_in), 1), '°C']);
      if (c.compressor) out.push(['mdi:sine-wave', this.t('compressor'), this._num(i.hz, 0), this.t('u_hz')]);
      if (c.electric_power && c.cop) out.push(['mdi:fire', this.t('heat_out'), this._num(pkw * cop, 1), this.t('u_kw')]);
      if (c.energy_today) out.push(['mdi:counter', this.t('today'), this._num(toKwh(this._st(c.energy_today)), 1), this.t('u_kwh')]);
      return out;
    }
    _sh_hp() {
      var c = this._c._hp, self = this;
      if (!c) return null;
      var i = this._hpInfo();
      var modes = i.modes.map(function (m) { return self._shOpt(m.icon, self.t('hp_' + m.key), i.on && i.mode === m.key, 'hp_mode', { v: m.key, close: 1 }); });
      var fn = [[c.quiet, 'mdi:volume-off', 'quiet'], [c.weather_comp, 'mdi:chart-bell-curve-cumulative', 'weather_comp'], [c.dhw_boost, 'mdi:lightning-bolt', 'dhw_boost']]
        .filter(function (x) { return !!x[0]; })
        .map(function (x) { return self._shOpt(x[1], self.t(x[2]), self._isOn(x[0]), 'toggle', { e: x[0] }); });
      var data = this._hpStats().map(function (x) { return self._shInfo(x[0], x[1], x[2], x[3]); });
      return {
        title: this.t('ctl'),
        sections: [this._shSec(this.t('modes'), 'mdi:tune-variant', modes, 2), this._shSec(this.t('functions'), 'mdi:toggle-switch-outline', fn, fn.length === 3 ? 3 : 2),
          this._shSec(this.t('data'), 'mdi:chart-box-outline', data, 2)]
      };
    }

    /* ============================================================= SOLAR */
    _solarVals() {
      var c = this._c._solar;
      var bat = toW(this._st(c.battery_power));
      var grid = toW(this._st(c.grid_power));
      if (c.battery_invert && !isNaN(bat)) bat = -bat;
      if (c.grid_invert && !isNaN(grid)) grid = -grid;
      return {
        pv: toW(this._st(c.pv_power)), load: toW(this._st(c.load)), bat: bat, grid: grid,
        soc: this._n(c.battery_soc)
      };
    }
    _tileSolar() {
      var c = this._c._solar, v = this._solarVals();
      var pv = this._power(v.pv);
      var st = !isNaN(v.soc) ? this.t('battery') + ' ' + this._num(v.soc, 0) + '%' : '';
      if (!isNaN(v.grid)) {
        var g = this._power(Math.abs(v.grid));
        st += (st ? ' · ' : '') + (v.grid > 20 ? '↓' + g.v + ' ' + g.u : v.grid < -20 ? '↑' + g.v + ' ' + g.u : this.t('grid') + ' 0');
      }
      return this._tile('nav', 'mdi:solar-power-variant', c.name || this.t('solar'), st,
        isNaN(v.pv) ? '' : pv.v + '<small>' + pv.u + '</small>', v.pv > 10, { p: 'solar' });
    }
    _p_solar() {
      var c = this._c._solar, self = this;
      if (!c) return this._p_home();
      var v = this._solarVals();
      var w = this._st(this._c.weather), sun = this._st('sun.sun');
      var sub = [];
      if (w && w.attributes.cloud_coverage !== undefined) sub.push('☁ ' + this._num(Number(w.attributes.cloud_coverage), 0) + '%');
      if (sun && sun.attributes.elevation !== undefined) sub.push('☀ ' + this._num(Number(sun.attributes.elevation), 0) + '°');
      var hdr = this._hdr(c.name || this.t('solar'), sub.join('  ·  '));

      var W = 456, H = 280, cx = W / 2, cy = H / 2, R = 44, IR = 25;
      var nodes = {};
      if (c.pv_power) nodes.pv = { x: 76, y: 64, c: COL.sun, icon: 'mdi:solar-power-variant', l: this.t('pv'), p: v.pv };
      if (c.battery_power || c.battery_soc) nodes.bat = { x: 76, y: 216, c: COL.bat, icon: this._batIcon(v.soc, v.bat), l: this.t('battery'), p: v.bat };
      if (c.grid_power) nodes.grid = { x: 380, y: 64, c: COL.grid, icon: 'mdi:transmission-tower', l: this.t('grid'), p: v.grid };
      if (c.load) nodes.home = { x: 380, y: 216, c: COL.home, icon: 'mdi:home-lightning-bolt-outline', l: this.t('home'), p: v.load };
      var flows = [
        ['pv', v.pv > 10, true, v.pv],
        ['bat', Math.abs(v.bat) > 10, v.bat < 0, Math.abs(v.bat)],
        ['grid', Math.abs(v.grid) > 10, v.grid > 0, Math.abs(v.grid)],
        ['home', v.load > 10, false, v.load]
      ];
      var svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
      flows.forEach(function (f) {
        var n = nodes[f[0]];
        if (!n) return;
        var dx = cx - n.x, dy = cy - n.y, len = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / len, uy = dy / len;
        var x1 = n.x + ux * (R + 4), y1 = n.y + uy * (R + 4), x2 = cx - ux * (IR + 4), y2 = cy - uy * (IR + 4);
        svg += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
          '" stroke="' + (f[1] ? n.c : 'var(--track)') + '" stroke-opacity="' + (f[1] ? 0.35 : 1) + '" stroke-width="3" stroke-linecap="round"></line>';
        if (f[1]) {
          var p = f[2] ? 'M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ',' + y2.toFixed(1)
            : 'M' + x2.toFixed(1) + ',' + y2.toFixed(1) + ' L' + x1.toFixed(1) + ',' + y1.toFixed(1);
          var dur = clamp(3.2 - f[3] / 2000, 0.7, 3.2).toFixed(1);
          for (var k = 0; k < 2; k++) {
            svg += '<circle data-k="' + f[0] + (f[2] ? 'i' : 'o') + k + '" r="4.5" fill="' + n.c + '">' +
              '<animateMotion dur="' + dur + 's" begin="' + (-k * dur / 2).toFixed(2) + 's" repeatCount="indefinite" path="' + p + '"></animateMotion></circle>';
          }
        }
      });
      if (nodes.bat && !isNaN(v.soc)) {
        var br = R + 7, bc = 2 * Math.PI * br, nb = nodes.bat;
        svg += '<circle cx="' + nb.x + '" cy="' + nb.y + '" r="' + br + '" fill="none" stroke="var(--track)" stroke-width="4"></circle>' +
          '<circle class="arc" cx="' + nb.x + '" cy="' + nb.y + '" r="' + br + '" fill="none" stroke="' + COL.bat + '" stroke-width="4" stroke-linecap="round" ' +
          'style="stroke-dasharray:' + (bc * clamp(v.soc, 0, 100) / 100).toFixed(1) + ' ' + bc.toFixed(1) + '" transform="rotate(-90 ' + nb.x + ' ' + nb.y + ')"></circle>';
      }
      svg += '</svg>';

      var html = '<div class="flow">' + svg;
      Object.keys(nodes).forEach(function (k) {
        var n = nodes[k];
        var p = self._power(Math.abs(n.p));
        var val = p.v + ' ' + p.u;
        var lbl = n.l;
        if (k === 'bat') {
          val = !isNaN(v.soc) ? self._num(v.soc, 0) + '%' : val;
          lbl = Math.abs(v.bat) > 10 ? (v.bat > 0 ? '↓ ' : '↑ ') + p.v + ' ' + p.u : n.l;
        }
        if (k === 'grid' && Math.abs(v.grid) > 10) lbl = v.grid > 0 ? self.t('import') : self.t('export');
        var idle = (isNaN(n.p) || Math.abs(n.p) <= 10) && k !== 'bat';
        html += '<div class="fn' + (idle ? ' idle' : '') + '" style="left:' + (n.x - R) + 'px;top:' + (n.y - R) + 'px;--c:' + n.c + '">' +
          ic(n.icon) + '<div class="fn-v">' + esc(val) + '</div><div class="fn-l">' + esc(lbl) + '</div></div>';
      });
      html += '<div class="inv" style="left:' + (cx - IR) + 'px;top:' + (cy - IR) + 'px">' + ic('mdi:sine-wave') + '</div></div>';

      var ep = toKwh(this._st(c.energy_today)), ei = toKwh(this._st(c.import_today)), ee = toKwh(this._st(c.export_today));
      var list = [];
      if (c.energy_today) list.push(this._kpi('mdi:solar-power', this.t('produced'), this._num(ep, 1), this.t('u_kwh')));
      if (c.import_today) list.push(this._kpi('mdi:transmission-tower-import', this.t('import'), this._num(ei, 1), this.t('u_kwh')));
      if (c.export_today) list.push(this._kpi('mdi:transmission-tower-export', this.t('export'), this._num(ee, 1), this.t('u_kwh')));
      if (c.energy_today && c.export_today) {
        var selfUse = ep > 0 ? clamp((ep - (isNaN(ee) ? 0 : ee)) / ep * 100, 0, 100) : NaN;
        list.push(this._kpi('mdi:home-percent-outline', this.t('self_use'), this._num(selfUse, 0), '%'));
      }
      return hdr + html + this._kpis(list);
    }
    _batIcon(soc, p) {
      if (isNaN(soc)) return 'mdi:battery';
      var lvl = clamp(Math.round(soc / 10) * 10, 0, 100);
      if (Math.abs(p) > 10 && p > 0) return lvl >= 100 ? 'mdi:battery-charging-100' : lvl <= 0 ? 'mdi:battery-charging-outline' : 'mdi:battery-charging-' + lvl;
      return lvl >= 100 ? 'mdi:battery' : lvl <= 0 ? 'mdi:battery-outline' : 'mdi:battery-' + lvl;
    }

    /* =========================================================== WEATHER */
    _p_weather() {
      var w = this._st(this._c.weather), self = this;
      if (!w) return this._hdr(this.t('weather'), '') + '<div class="na">' + ic('mdi:weather-cloudy') + '</div>';
      var a = w.attributes, cond = w.state;
      var hdr = this._hdr(this.t('weather'), (this.t('w') || {})[cond] || cond);
      var ws = a.wind_speed, wu = a.wind_speed_unit || 'km/h';
      var wind = ws !== undefined ? (wu === 'km/h' ? this._num(ws / 3.6, 1) + ' ' + this.t('u_ms') : this._num(ws, 1) + ' ' + wu) : '—';
      var now = '<div class="wnow">' + ic(WX_ICON[cond] || 'mdi:weather-cloudy', 'wx-ic', 'color:' + (WX_COLOR[cond] || '#94a3b8')) +
        '<div class="wnow-t">' + this._num(Number(a.temperature), 1) + '°</div>' +
        '<div class="wnow-d">' + esc(this.t('humidity')) + ': ' + this._num(Number(a.humidity), 0) + '%<br>' +
        esc(this.t('wind')) + ': ' + wind + '<br>' + esc(this.t('pressure')) + ': ' + this._num(Number(a.pressure), 0) + ' ' + (a.pressure_unit || this.t('u_hpa')) + '</div></div>';
      var fc = (this._forecast || []).slice(0, 5);
      var rows = fc.map(function (f) {
        var d = new Date(f.datetime), name;
        try { name = cap(new Intl.DateTimeFormat(self._locale(), { weekday: 'short', day: 'numeric' }).format(d)); } catch (e) { name = d.toDateString(); }
        return '<div class="fcr"><div class="fcr-d">' + esc(name) + '</div>' +
          ic(WX_ICON[f.condition] || 'mdi:weather-cloudy', '', 'color:' + (WX_COLOR[f.condition] || '#94a3b8')) +
          '<div class="fcr-p">' + (f.precipitation_probability ? '☂ ' + self._num(f.precipitation_probability, 0) + '%' : '') + '</div>' +
          '<div class="fcr-t">' + self._num(f.temperature, 0) + '°' + (f.templow !== undefined && f.templow !== null ? '<span>' + self._num(f.templow, 0) + '°</span>' : '') + '</div></div>';
      }).join('');
      return hdr + now + (rows ? '<div class="fc">' + rows + '</div>' : '');
    }

    /* ============================================================== MENU */
    _p_menu() {
      var self = this;
      var theme = this._setting('theme'), lang = this._curLang, acc = this._setting('accent');
      var th = [['dark', 'mdi:weather-night'], ['light', 'mdi:white-balance-sunny'], ['auto', 'mdi:theme-light-dark']];
      return this._hdr(this.t('settings'), '') +
        '<div class="sec"><div class="sec-t">' + ic('mdi:palette-outline') + esc(this.t('theme')) + '</div><div class="seg n3">' +
        th.map(function (x) { return self._sb(x[1], self.t(x[0]), theme === x[0], 'set', { s: 'theme', v: x[0] }); }).join('') + '</div></div>' +
        '<div class="sec"><div class="sec-t">' + ic('mdi:translate') + esc(this.t('language')) + '</div><div class="seg n3">' +
        ['ru', 'lv', 'en'].map(function (l) { return self._sb(null, LANG_NAMES[l], lang === l, 'set', { s: 'language', v: l }); }).join('') + '</div></div>' +
        '<div class="sec"><div class="sec-t">' + ic('mdi:format-color-fill') + esc(this.t('accent')) + '</div><div class="sw">' +
        Object.keys(ACCENTS).map(function (k) {
          var on = acc === k;
          return '<button class="swc" data-a="set" data-s="accent" data-v="' + k + '" style="background:' + ACCENTS[k] +
            (on ? ';box-shadow:0 0 0 3px var(--sf),0 0 0 5px ' + ACCENTS[k] : '') + '">' + (on ? ic('mdi:check') : '') + '</button>';
        }).join('') + '</div></div>' +
        '<div class="about">NSPanel Pro Card v' + VERSION + '</div>';
    }

    /* ============================================================ EVENTS */
    _onClick(e) {
      var path = e.composedPath ? e.composedPath() : [];
      var el = null;
      for (var i = 0; i < path.length; i++) {
        var n = path[i];
        if (n === this.shadowRoot) break;
        if (n.getAttribute && n.getAttribute('data-a')) { el = n; break; }
      }
      if (!el) return;
      this._lastTouch = Date.now();
      var a = el.getAttribute('data-a');
      if (el.getAttribute('data-close') && this._sheet) { this._sheet = null; this._render(); }
      var d = function (k) { return el.getAttribute('data-' + k); };
      var c = this._c, self = this;

      switch (a) {
        case 'noop': return;
        case 'nav': this._page = d('p'); this._sheet = null; this._render(true); return;
        case 'home': this._page = 'home'; this._sheet = null; this._render(true); return;
        case 'set': this._setSetting(d('s'), d('v')); return;
        case 'toggle': this._call('homeassistant', 'toggle', { entity_id: d('e') }); return;
        case 'cbtn': { var b = c._buttons[Number(d('i'))]; if (b) this._runButton(b); return; }
        case 'sheet': this._sheet = { kind: d('v') }; this._render(); return;
        case 'sheet_close': this._sheet = null; this._render(); return;
        case 'ac_set': {
          var acx = c._acs[this._acIdx], kd = d('k');
          var data = { entity_id: acx.entity };
          data[kd + '_mode'] = d('v');
          this._call('climate', 'set_' + kd + '_mode', data);
          return;
        }
        /* recuperator */
        case 'rec_power': this._call('homeassistant', 'toggle', { entity_id: c._rec.power }); return;
        case 'rec_mode': {
          var rc = c._rec, m = d('v'), info = this._recInfo();
          if (rc.power && !info.on) this._call('homeassistant', 'turn_on', { entity_id: rc.power });
          if (m === 'boost' && rc.boost_button) this._press(rc.boost_button);
          else {
            var opt = this._recOption(m);
            if (opt && rc.mode) this._selectOption(rc.mode, opt);
          }
          return;
        }
        case 'rec_af': {
          var ra = c._rec, as = this._st(ra.airflow_target);
          if (!as) return;
          var ast = Number(ra.airflow_step) || 10;
          var amin = Number(as.attributes.min), amax = Number(as.attributes.max);
          this._bump(ra.airflow_target, this._pv(ra.airflow_target, parseFloat(as.state)), Number(d('d')) * ast,
            isNaN(amin) ? 0 : amin, isNaN(amax) ? 100 : amax, ast, function (v) { self._setNumber(ra.airflow_target, v); });
          return;
        }
        case 'rec_t': {
          var rt = c._rec, ts = this._st(rt.target);
          if (!ts) return;
          var step = Number(rt.target_step) || 0.5;
          this._bump(rt.target, this._pv(rt.target, parseFloat(ts.state)), Number(d('d')) * step,
            Number(ts.attributes.min), Number(ts.attributes.max), step, function (v) { self._setNumber(rt.target, v); });
          return;
        }

        /* air conditioner */
        case 'ac_sel': this._acIdx = Number(d('i')); this._render(true); return;
        case 'ac_power': {
          var ac = c._acs[this._acIdx], s = this._st(ac.entity);
          if (!s) return;
          var sf = s.attributes.supported_features || 0;
          if (s.state === 'off') {
            if (sf & 256) this._call('climate', 'turn_on', { entity_id: ac.entity });
            else {
              var hm = (s.attributes.hvac_modes || []).filter(function (x) { return x !== 'off'; });
              this._call('climate', 'set_hvac_mode', { entity_id: ac.entity, hvac_mode: hm.indexOf('auto') >= 0 ? 'auto' : hm[0] });
            }
          } else if (sf & 128) this._call('climate', 'turn_off', { entity_id: ac.entity });
          else this._call('climate', 'set_hvac_mode', { entity_id: ac.entity, hvac_mode: 'off' });
          return;
        }
        case 'ac_mode': this._call('climate', 'set_hvac_mode', { entity_id: c._acs[this._acIdx].entity, hvac_mode: d('v') }); return;
        case 'ac_t': {
          var ac3 = c._acs[this._acIdx], s3 = this._st(ac3.entity);
          if (!s3) return;
          var at = s3.attributes, st3 = Number(at.target_temp_step) || Number(ac3.step) || 1;
          var key = ac3.entity + ':t';
          this._bump(key, this._pv(key, Number(at.temperature)), Number(d('d')) * st3, Number(at.min_temp), Number(at.max_temp), st3, function (v) {
            self._call('climate', 'set_temperature', { entity_id: ac3.entity, temperature: v });
          });
          return;
        }
        /* heat pump */
        case 'hp_power': this._call('homeassistant', 'toggle', { entity_id: c._hp.power }); return;
        case 'hp_mode': {
          var hp = c._hp, key2 = d('v');
          if (hp.power && !this._isOn(hp.power)) this._call('homeassistant', 'turn_on', { entity_id: hp.power });
          this._hpModes().forEach(function (mm) { if (mm.key === key2) self._selectOption(hp.mode, mm.option); });
          return;
        }
        case 'hp_t': {
          var hp2 = c._hp;
          var eid = d('k2') === 'w' ? hp2.water_target : hp2.dhw_target;
          var es = this._st(eid);
          if (!es) return;
          var stp = d('k2') === 'w' ? (Number(hp2.water_step) || 0.5) : (Number(hp2.dhw_step) || 1);
          if (eid.split('.')[0] === 'water_heater' || eid.split('.')[0] === 'climate') {
            this._bump(eid, this._pv(eid, Number(es.attributes.temperature)), Number(d('d')) * stp, Number(es.attributes.min_temp), Number(es.attributes.max_temp), stp, function (v) {
              self._call(eid.split('.')[0], 'set_temperature', { entity_id: eid, temperature: v });
            });
            return;
          }
          this._bump(eid, this._pv(eid, parseFloat(es.state)), Number(d('d')) * stp, Number(es.attributes.min), Number(es.attributes.max), stp, function (v) {
            self._setNumber(eid, v);
          });
          return;
        }
      }
    }
  }

  /* ================================================================ EDITOR */
  var EL = {
    en: {
      device: 'Device type', dev_nspanel: 'Sonoff NSPanel Pro (480×480, full screen)', dev_phone: 'Phone (portrait, scrollable)',
      weather: 'Weather entity', home_timeout: 'Return to home screen after (s, 0 = never)', show_settings: 'Show menu button',
      sec_appearance: 'Appearance', theme: 'Default theme', language: 'Default language', accent: 'Default accent colour',
      theme_entity: 'Theme helper (optional input_select)', language_entity: 'Language helper (optional input_select)', accent_entity: 'Accent helper (optional input_select)',
      dark: 'Dark', light: 'Light', auto: 'Auto (sun)',
      c_blue: 'Blue', c_teal: 'Teal', c_green: 'Green', c_amber: 'Amber', c_orange: 'Orange', c_red: 'Red', c_pink: 'Pink', c_purple: 'Purple',
      sec_recuperator: 'Recuperator (ventilation)', sec_air_conditioner: 'Air conditioners', sec_heat_pump: 'Heat pump', sec_solar: 'Solar inverter',
      sec_screensaver: 'Clock screensaver', timeout: 'Show after (s)', timeout_entity: 'Timeout helper (input_number)', enabled_entity: 'On/off helper (input_boolean)', wake_entities: 'Wake on change of (proximity / presence / event)', users: 'Only for HA users (empty = all)', on_start: 'Run on start (script)', on_wake: 'Run on wake (script)', show_weather: 'Show weather',
      sec_button_1: 'Custom button 1', sec_button_2: 'Custom button 2', sec_modes: 'Mode mapping', sec_hp_modes: 'Mode mapping',
      enabled: 'Connected (show on panel)', name: 'Name (optional)',
      power: 'Power switch', mode: 'Mode (select)', target: 'Target temperature (number)', target_step: 'Target step',
      indoor: 'Indoor temperature', outdoor: 'Outdoor temperature', supply: 'Supply air temperature', extract: 'Extract air temperature',
      exhaust: 'Exhaust air temperature', efficiency: 'Heat recovery efficiency %', airflow: 'Airflow / fan level %', airflow_target: 'Airflow set point % (number)', airflow_step: 'Airflow step', airflow_m3h: 'Airflow m³/h', fan_rpm: 'Fan speed (rpm)',
      filter_days: 'Days until filter change', status: 'Status sensor', error_count: 'Active errors count', error_text: 'Error text',
      boost_button: 'Boost button / script', boost_remaining: 'Boost time left (s)', night_cooling: 'Night cooling switch',
      mode_protection: 'Option for “Protection”', mode_economy: 'Option for “Economy”', mode_comfort: 'Option for “Comfort”', mode_boost: 'Option for “Boost”',
      entities: 'Climate entities',
      mode_heat: 'Option for “Heating”', mode_cool: 'Option for “Cooling”', mode_dhw: 'Option for “Hot water”', mode_auto: 'Option for “Auto”',
      water_target: 'Heating water target (number / water_heater)', dhw_target: 'Hot water target (number / water_heater)',
      water_out: 'Flow water temperature', water_in: 'Return water temperature', dhw_tank: 'DHW tank temperature',
      compressor: 'Compressor frequency', electric_power: 'Electric power (W or kW)', cop: 'COP', energy_today: 'Energy today',
      quiet: 'Quiet mode switch', weather_comp: 'Weather compensation switch', dhw_boost: 'DHW boost switch',
      pv_power: 'PV power', load: 'House load power', battery_power: 'Battery power', battery_soc: 'Battery state of charge %',
      grid_power: 'Grid power', import_today: 'Grid import today', export_today: 'Grid export today',
      battery_invert: 'Invert battery sign', grid_invert: 'Invert grid sign',
      icon: 'Icon', action: 'Tap action', navigation_path: 'Navigation path', url: 'URL', entity: 'Entity', subtitle: 'Subtitle',
      new_tab: 'Open URL in new tab',
      a_navigate: 'Go to dashboard / view', a_url: 'Open URL', a_more_info: 'Show entity info', a_toggle: 'Toggle / press entity'
    },
    ru: {
      device: 'Тип устройства', dev_nspanel: 'Sonoff NSPanel Pro (480×480, весь экран)', dev_phone: 'Телефон (вертикально, с прокруткой)',
      weather: 'Погода', home_timeout: 'Возврат на главный экран через (с, 0 = никогда)', show_settings: 'Показывать кнопку меню',
      sec_appearance: 'Внешний вид', theme: 'Тема по умолчанию', language: 'Язык по умолчанию', accent: 'Цвет акцента по умолчанию',
      theme_entity: 'Хелпер темы (необязательно, input_select)', language_entity: 'Хелпер языка (необязательно, input_select)', accent_entity: 'Хелпер цвета (необязательно, input_select)',
      dark: 'Тёмная', light: 'Светлая', auto: 'Авто (по солнцу)',
      c_blue: 'Синий', c_teal: 'Бирюзовый', c_green: 'Зелёный', c_amber: 'Янтарный', c_orange: 'Оранжевый', c_red: 'Красный', c_pink: 'Розовый', c_purple: 'Фиолетовый',
      sec_recuperator: 'Рекуператор (вентиляция)', sec_air_conditioner: 'Кондиционеры', sec_heat_pump: 'Тепловой насос', sec_solar: 'Инвертор солнечной станции',
      sec_screensaver: 'Заставка-часы', timeout: 'Показывать через (с)', timeout_entity: 'Хелпер времени (input_number)', enabled_entity: 'Хелпер вкл/выкл (input_boolean)', wake_entities: 'Будить при изменении (приближение / присутствие / событие)', users: 'Только для пользователей HA (пусто = все)', on_start: 'Запустить при начале (скрипт)', on_wake: 'Запустить при пробуждении (скрипт)', show_weather: 'Показывать погоду',
      sec_button_1: 'Своя кнопка 1', sec_button_2: 'Своя кнопка 2', sec_modes: 'Соответствие режимов', sec_hp_modes: 'Соответствие режимов',
      enabled: 'Подключено (показывать на панели)', name: 'Название (необязательно)',
      power: 'Выключатель питания', mode: 'Режим (select)', target: 'Целевая температура (number)', target_step: 'Шаг уставки',
      indoor: 'Температура в доме', outdoor: 'Наружная температура', supply: 'Температура притока', extract: 'Температура вытяжки',
      exhaust: 'Температура выброса', efficiency: 'Эффективность рекуперации %', airflow: 'Расход / уровень вентилятора %', airflow_target: 'Уставка расхода % (number)', airflow_step: 'Шаг расхода', airflow_m3h: 'Расход м³/ч', fan_rpm: 'Обороты вентилятора',
      filter_days: 'Дней до замены фильтра', status: 'Сенсор статуса', error_count: 'Количество ошибок', error_text: 'Текст ошибок',
      boost_button: 'Кнопка / скрипт интенсивного режима', boost_remaining: 'Осталось интенсивного режима (с)', night_cooling: 'Ночное охлаждение (выключатель)',
      mode_protection: 'Опция для «Защита»', mode_economy: 'Опция для «Эконом»', mode_comfort: 'Опция для «Комфорт»', mode_boost: 'Опция для «Интенсив»',
      entities: 'Сущности climate',
      mode_heat: 'Опция для «Отопление»', mode_cool: 'Опция для «Охлаждение»', mode_dhw: 'Опция для «Горячая вода»', mode_auto: 'Опция для «Авто»',
      water_target: 'Уставка воды отопления (number / water_heater)', dhw_target: 'Уставка ГВС (number / water_heater)',
      water_out: 'Температура подачи', water_in: 'Температура обратки', dhw_tank: 'Температура бака ГВС',
      compressor: 'Частота компрессора', electric_power: 'Потребляемая мощность (W или kW)', cop: 'COP', energy_today: 'Энергия за сегодня',
      quiet: 'Тихий режим (выключатель)', weather_comp: 'Погодозависимый режим (выключатель)', dhw_boost: 'Быстрый нагрев ГВС (выключатель)',
      pv_power: 'Мощность PV', load: 'Потребление дома', battery_power: 'Мощность батареи', battery_soc: 'Заряд батареи %',
      grid_power: 'Мощность сети', import_today: 'Импорт из сети за сегодня', export_today: 'Экспорт в сеть за сегодня',
      battery_invert: 'Инвертировать знак батареи', grid_invert: 'Инвертировать знак сети',
      icon: 'Иконка', action: 'Действие при нажатии', navigation_path: 'Путь (дашборд / вид)', url: 'Ссылка', entity: 'Сущность', subtitle: 'Подпись',
      new_tab: 'Открывать ссылку в новой вкладке',
      a_navigate: 'Перейти на дашборд / вид', a_url: 'Открыть ссылку', a_more_info: 'Показать карточку сущности', a_toggle: 'Переключить / нажать'
    },
    lv: {
      device: 'Ierīces tips', dev_nspanel: 'Sonoff NSPanel Pro (480×480, pilnekrāns)', dev_phone: 'Telefons (vertikāli, ar ritināšanu)',
      weather: 'Laikapstākļi', home_timeout: 'Atgriezties sākumā pēc (s, 0 = nekad)', show_settings: 'Rādīt izvēlnes pogu',
      sec_appearance: 'Izskats', theme: 'Noklusējuma tēma', language: 'Noklusējuma valoda', accent: 'Noklusējuma akcenta krāsa',
      theme_entity: 'Tēmas palīgs (neobligāti, input_select)', language_entity: 'Valodas palīgs (neobligāti, input_select)', accent_entity: 'Krāsas palīgs (neobligāti, input_select)',
      dark: 'Tumšā', light: 'Gaišā', auto: 'Auto (pēc saules)',
      c_blue: 'Zila', c_teal: 'Tirkīza', c_green: 'Zaļa', c_amber: 'Dzintara', c_orange: 'Oranža', c_red: 'Sarkana', c_pink: 'Rozā', c_purple: 'Violeta',
      sec_recuperator: 'Rekuperators (ventilācija)', sec_air_conditioner: 'Kondicionieri', sec_heat_pump: 'Siltumsūknis', sec_solar: 'Saules invertors',
      sec_screensaver: 'Pulksteņa ekrānsaudzētājs', timeout: 'Rādīt pēc (s)', timeout_entity: 'Laika palīgs (input_number)', enabled_entity: 'Iesl./izsl. palīgs (input_boolean)', wake_entities: 'Modināt pie izmaiņām (tuvums / klātbūtne / notikums)', users: 'Tikai HA lietotājiem (tukšs = visiem)', on_start: 'Palaist sākumā (skripts)', on_wake: 'Palaist pamostoties (skripts)', show_weather: 'Rādīt laikapstākļus',
      sec_button_1: 'Sava poga 1', sec_button_2: 'Sava poga 2', sec_modes: 'Režīmu atbilstība', sec_hp_modes: 'Režīmu atbilstība',
      enabled: 'Pievienots (rādīt panelī)', name: 'Nosaukums (neobligāti)',
      power: 'Barošanas slēdzis', mode: 'Režīms (select)', target: 'Mērķa temperatūra (number)', target_step: 'Iestatījuma solis',
      indoor: 'Iekštelpu temperatūra', outdoor: 'Āra temperatūra', supply: 'Pieplūdes temperatūra', extract: 'Nosūces temperatūra',
      exhaust: 'Izplūdes temperatūra', efficiency: 'Rekuperācijas efektivitāte %', airflow: 'Plūsma / ventilatora līmenis %', airflow_target: 'Plūsmas iestatījums % (number)', airflow_step: 'Plūsmas solis', airflow_m3h: 'Plūsma m³/h', fan_rpm: 'Ventilatora apgriezieni',
      filter_days: 'Dienas līdz filtra maiņai', status: 'Statusa sensors', error_count: 'Kļūdu skaits', error_text: 'Kļūdu teksts',
      boost_button: 'Intensīvā režīma poga / skripts', boost_remaining: 'Atlikušais intensīvā režīma laiks (s)', night_cooling: 'Nakts dzesēšanas slēdzis',
      mode_protection: 'Opcija “Aizsardzība”', mode_economy: 'Opcija “Ekonomija”', mode_comfort: 'Opcija “Komforts”', mode_boost: 'Opcija “Intensīvs”',
      entities: 'Climate entītijas',
      mode_heat: 'Opcija “Apkure”', mode_cool: 'Opcija “Dzesēšana”', mode_dhw: 'Opcija “Karstais ūdens”', mode_auto: 'Opcija “Auto”',
      water_target: 'Apkures ūdens iestatījums (number / water_heater)', dhw_target: 'KŪ iestatījums (number / water_heater)',
      water_out: 'Turpgaitas temperatūra', water_in: 'Atgaitas temperatūra', dhw_tank: 'KŪ tvertnes temperatūra',
      compressor: 'Kompresora frekvence', electric_power: 'Elektriskā jauda (W vai kW)', cop: 'COP', energy_today: 'Enerģija šodien',
      quiet: 'Klusā režīma slēdzis', weather_comp: 'Laikapstākļu līknes slēdzis', dhw_boost: 'Ātrās KŪ uzsildīšanas slēdzis',
      pv_power: 'PV jauda', load: 'Mājas patēriņš', battery_power: 'Akumulatora jauda', battery_soc: 'Akumulatora uzlāde %',
      grid_power: 'Tīkla jauda', import_today: 'Imports no tīkla šodien', export_today: 'Eksports uz tīklu šodien',
      battery_invert: 'Invertēt akumulatora zīmi', grid_invert: 'Invertēt tīkla zīmi',
      icon: 'Ikona', action: 'Darbība', navigation_path: 'Ceļš (panelis / skats)', url: 'Saite', entity: 'Entītija', subtitle: 'Paraksts',
      new_tab: 'Atvērt saiti jaunā cilnē',
      a_navigate: 'Pāriet uz paneli / skatu', a_url: 'Atvērt saiti', a_more_info: 'Rādīt entītijas info', a_toggle: 'Pārslēgt / nospiest'
    }
  };
  var EH = {
    en: {
      device: 'NSPanel: fixed 480×480 layout scaled to the screen. Phone: portrait layout with scrolling.',
      battery_invert: 'Card expects + = charging. Enable if your inverter reports + when discharging.',
      grid_invert: 'Card expects + = import from grid. Enable if your inverter reports + when exporting.',
      theme_entity: 'Without helpers the choice made on the panel is stored in the browser of that device.',
      mode_protection: 'Leave empty for auto-detection by option name.',
      mode_heat: 'Leave empty for auto-detection by option name.'
    },
    ru: {
      device: 'NSPanel: фиксированная раскладка 480×480, масштабируется под экран. Телефон: вертикальная раскладка с прокруткой.',
      battery_invert: 'Карточка ожидает «+» = заряд. Включите, если инвертор показывает «+» при разряде.',
      grid_invert: 'Карточка ожидает «+» = импорт из сети. Включите, если инвертор показывает «+» при экспорте.',
      theme_entity: 'Без хелперов выбор, сделанный на панели, хранится в браузере этого устройства.',
      mode_protection: 'Оставьте пустым — режим определится по названию опции.',
      mode_heat: 'Оставьте пустым — режим определится по названию опции.'
    },
    lv: {
      device: 'NSPanel: fiksēts 480×480 izkārtojums, mērogots ekrānam. Telefons: vertikāls izkārtojums ar ritināšanu.',
      battery_invert: 'Kartīte sagaida “+” = uzlāde. Ieslēdziet, ja invertors rāda “+” izlādes laikā.',
      grid_invert: 'Kartīte sagaida “+” = imports no tīkla. Ieslēdziet, ja invertors rāda “+” eksporta laikā.',
      theme_entity: 'Bez palīgiem panelī izdarītā izvēle tiek saglabāta šīs ierīces pārlūkā.',
      mode_protection: 'Atstājiet tukšu automātiskai noteikšanai pēc opcijas nosaukuma.',
      mode_heat: 'Atstājiet tukšu automātiskai noteikšanai pēc opcijas nosaukuma.'
    }
  };

  function cleanObj(o) {
    if (Array.isArray(o)) return o.map(cleanObj).filter(function (x) { return x !== undefined; });
    if (!isObj(o)) return o;
    var out = {};
    Object.keys(o).forEach(function (k) {
      var v = cleanObj(o[k]);
      if (v === undefined || v === null || v === '') return;
      if (Array.isArray(v) && !v.length && k !== 'entities') return;
      out[k] = v;
    });
    return out;
  }

  class NSPanelProCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = JSON.parse(JSON.stringify(config || {}));
      this._update();
    }
    set hass(hass) {
      this._hass = hass;
      if (this._form) this._form.hass = hass;
      else this._update();
    }
    connectedCallback() { this._update(); }

    _lang() {
      var l = ((this._hass && this._hass.language) || 'en').slice(0, 2);
      return EL[l] ? l : 'en';
    }
    _L(k) { var l = this._lang(); return EL[l][k] || EL.en[k] || k; }

    _load() {
      if (this._loading) return this._loading;
      this._loading = (async function () {
        if (!customElements.get('ha-form') || !customElements.get('ha-entity-picker')) {
          try {
            var helpers = await window.loadCardHelpers();
            var card = await helpers.createCardElement({ type: 'entities', entities: [] });
            if (card && card.constructor && card.constructor.getConfigElement) await card.constructor.getConfigElement();
          } catch (e) { /* ignore */ }
        }
        await customElements.whenDefined('ha-form');
      })();
      return this._loading;
    }

    _update() {
      if (!this._hass || !this._config) return;
      var self = this;
      this._load().then(function () {
        if (!self._form) {
          self.innerHTML = '';
          var info = document.createElement('div');
          info.style.cssText = 'font-size:12px;opacity:.7;margin:0 0 12px';
          info.textContent = 'NSPanel Pro Card v' + VERSION;
          self.appendChild(info);
          self._form = document.createElement('ha-form');
          self._form.addEventListener('value-changed', function (ev) { self._changed(ev); });
          self.appendChild(self._form);
        }
        var data = self._toForm(self._config);
        self._form.hass = self._hass;
        self._form.data = data;
        self._form.schema = self._schema(data);
        self._form.computeLabel = function (s) { return s.title || self._L(s.name); };
        self._form.computeHelper = function (s) {
          var l = self._lang();
          return (EH[l] && EH[l][s.name]) || undefined;
        };
      });
    }

    _changed(ev) {
      ev.stopPropagation();
      var cfg = this._fromForm(ev.detail.value);
      this._config = cfg;
      var data = this._toForm(cfg);
      this._form.data = data;
      this._form.schema = this._schema(data);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
    }

    _toForm(c) {
      var d = JSON.parse(JSON.stringify(c || {}));
      delete d.type;
      var ac = isObj(d.air_conditioner) ? d.air_conditioner :
        (d.air_conditioners ? { enabled: true, entities: d.air_conditioners } : { enabled: false });
      ac.entities = (ac.entities || []).map(function (a) { return typeof a === 'string' ? a : a && a.entity; }).filter(Boolean);
      if (ac.enabled === undefined) ac.enabled = true;
      d.air_conditioner = ac;
      delete d.air_conditioners;
      ['recuperator', 'heat_pump', 'solar', 'screensaver'].forEach(function (k) {
        if (!isObj(d[k])) d[k] = { enabled: false };
        else if (d[k].enabled === undefined) d[k].enabled = true;
      });
      var bs = d.custom_buttons || [];
      var withAction = function (b) {
        var o = Object.assign({ enabled: true }, b);
        if (!o.action) o.action = o.navigation_path ? 'navigate' : o.url ? 'url' : o.entity ? 'more-info' : 'navigate';
        return o;
      };
      d.button_1 = bs[0] ? withAction(bs[0]) : { enabled: false };
      d.button_2 = bs[1] ? withAction(bs[1]) : { enabled: false };
      delete d.custom_buttons;
      if (!d.device) d.device = 'nspanel';
      return d;
    }

    _fromForm(d) {
      var c = { type: 'custom:' + CARD };
      Object.keys(d).forEach(function (k) { if (k !== 'button_1' && k !== 'button_2') c[k] = d[k]; });
      var orig = (isObj(this._config.air_conditioner) && this._config.air_conditioner.entities) || this._config.air_conditioners || [];
      var named = {};
      orig.forEach(function (a) { if (isObj(a) && a.entity) named[a.entity] = a; });
      if (isObj(c.air_conditioner)) {
        c.air_conditioner = Object.assign({}, c.air_conditioner, {
          entities: (c.air_conditioner.entities || []).map(function (e) { return named[e] || e; })
        });
      }
      var bs = [];
      ['button_1', 'button_2'].forEach(function (k) {
        var b = d[k];
        if (b && (b.enabled || b.name || b.entity || b.navigation_path || b.url || b.icon)) bs.push(b);
      });
      var ob = this._config.custom_buttons || [];
      for (var i = 2; i < ob.length; i++) bs.push(ob[i]);
      if (bs.length) c.custom_buttons = bs;
      return cleanObj(c);
    }

    _schema(d) {
      var self = this, hass = this._hass, L = function (k) { return self._L(k); };
      var SENS = ['sensor', 'input_number', 'number'];
      var E = function (name, domain, multiple) {
        var sel = {};
        if (domain) sel.domain = domain;
        if (multiple) sel.multiple = true;
        return { name: name, selector: { entity: sel } };
      };
      var B = function (n) { return { name: n, selector: { boolean: {} } }; };
      var TX = function (n) { return { name: n, selector: { text: {} } }; };
      var G = function (schema) { return { type: 'grid', name: '', schema: schema }; };
      var SEL = function (n, values) {
        return { name: n, selector: { select: { mode: 'dropdown', options: values.map(function (v) { return { value: v[0], label: v[1] }; }) } } };
      };
      var OPT = function (n, eid) {
        var s = eid && hass.states[eid];
        var o = s && s.attributes.options;
        return o && o.length ? { name: n, selector: { select: { options: o, custom_value: true, mode: 'dropdown' } } } : TX(n);
      };
      var sec = function (name, icon, fields) {
        var en = isObj(d[name]) && d[name].enabled !== false;
        return { type: 'expandable', name: name, title: L('sec_' + name), icon: icon, schema: [B('enabled')].concat(en ? fields : []) };
      };
      var sub = function (title, icon, schema) { return { type: 'expandable', name: '', flatten: true, title: L(title), icon: icon, schema: schema }; };
      var btn = function (name) {
        var b = d[name] || {};
        if (b.enabled && !b.action) b.action = 'navigate';
        var act = b.action || (b.navigation_path ? 'navigate' : b.url ? 'url' : b.entity ? 'more-info' : 'navigate');
        var fields = [G([TX('name'), { name: 'icon', selector: { icon: {} } }]),
          SEL('action', [['navigate', L('a_navigate')], ['url', L('a_url')], ['more-info', L('a_more_info')], ['toggle', L('a_toggle')]])];
        if (act === 'navigate') fields.push({ name: 'navigation_path', selector: { navigation: {} } });
        if (act === 'url') fields.push(TX('url'), B('new_tab'));
        fields.push(G([E('entity'), TX('subtitle')]));
        return sec(name, 'mdi:gesture-tap-button', fields);
      };
      var rec = d.recuperator || {}, hp = d.heat_pump || {};

      return [
        SEL('device', [['nspanel', L('dev_nspanel')], ['phone', L('dev_phone')]]),
        G([E('weather', 'weather'), { name: 'home_timeout', selector: { number: { min: 0, max: 900, step: 5, mode: 'box', unit_of_measurement: 's' } } }]),
        sub('sec_appearance', 'mdi:palette-outline', [
          G([
            SEL('theme', [['dark', L('dark')], ['light', L('light')], ['auto', L('auto')]]),
            SEL('language', [['ru', 'Русский'], ['lv', 'Latviešu'], ['en', 'English']]),
            SEL('accent', Object.keys(ACCENTS).map(function (k) { return [k, L('c_' + k)]; })),
            B('show_settings')
          ]),
          E('theme_entity', 'input_select'), E('language_entity', 'input_select'), E('accent_entity', 'input_select')
        ]),
        sec('recuperator', 'mdi:hvac', [
          TX('name'),
          G([E('power', ['switch', 'input_boolean']), E('mode', ['select', 'input_select']),
            E('target', ['number', 'input_number']), { name: 'target_step', selector: { number: { min: 0.1, max: 5, step: 0.1, mode: 'box' } } }]),
          G([E('airflow', SENS), E('airflow_target', ['number', 'input_number']), E('airflow_m3h', SENS),
            { name: 'airflow_step', selector: { number: { min: 1, max: 50, step: 1, mode: 'box' } } }]),
          G([E('indoor', SENS), E('outdoor', SENS), E('supply', SENS), E('extract', SENS), E('exhaust', SENS),
            E('efficiency', SENS), E('fan_rpm', SENS), E('filter_days', SENS), E('night_cooling', ['switch', 'input_boolean']),
            E('boost_button', ['button', 'input_button', 'script']), E('boost_remaining', SENS),
            E('status', ['sensor', 'select', 'input_select']), E('error_count', SENS)]),
          E('error_text', 'sensor'),
          sub('sec_modes', 'mdi:format-list-bulleted', [G([OPT('mode_protection', rec.mode), OPT('mode_economy', rec.mode),
            OPT('mode_comfort', rec.mode), OPT('mode_boost', rec.mode)])])
        ]),
        sec('air_conditioner', 'mdi:air-conditioner', [TX('name'), E('entities', 'climate', true)]),
        sec('heat_pump', 'mdi:heat-pump-outline', [
          TX('name'),
          G([E('power', ['switch', 'input_boolean']), E('mode', ['select', 'input_select']),
            E('water_target', ['number', 'input_number', 'water_heater', 'climate']), E('dhw_target', ['number', 'input_number', 'water_heater', 'climate']),
            E('water_out', SENS), E('water_in', SENS), E('dhw_tank', SENS), E('outdoor', SENS),
            E('compressor', SENS), E('electric_power', SENS), E('cop', SENS), E('energy_today', SENS),
            E('status', ['sensor', 'select', 'input_select']), E('quiet', ['switch', 'input_boolean']),
            E('weather_comp', ['switch', 'input_boolean']), E('dhw_boost', ['switch', 'input_boolean'])]),
          sub('sec_hp_modes', 'mdi:format-list-bulleted', [G([OPT('mode_heat', hp.mode), OPT('mode_cool', hp.mode),
            OPT('mode_dhw', hp.mode), OPT('mode_auto', hp.mode)])])
        ]),
        sec('solar', 'mdi:solar-power-variant', [
          TX('name'),
          G([E('pv_power', SENS), E('load', SENS), E('battery_power', SENS), E('battery_soc', SENS),
            E('grid_power', SENS), E('energy_today', SENS), E('import_today', SENS), E('export_today', SENS),
            B('battery_invert'), B('grid_invert')])
        ]),
        sec('screensaver', 'mdi:clock-digital', [
          G([{ name: 'timeout', selector: { number: { min: 5, max: 3600, step: 5, mode: 'box', unit_of_measurement: 's' } } }, B('show_weather'),
            E('timeout_entity', ['input_number', 'number']), E('enabled_entity', ['input_boolean', 'switch'])]),
          E('wake_entities', null, true),
          { name: 'users', selector: { select: { multiple: true, custom_value: true, options: [] } } },
          G([E('on_start', ['script', 'scene', 'button', 'input_button']), E('on_wake', ['script', 'scene', 'button', 'input_button'])])
        ]),
        btn('button_1'),
        btn('button_2')
      ];
    }
  }

  if (!customElements.get(CARD)) customElements.define(CARD, NSPanelProCard);
  if (!customElements.get(EDITOR)) customElements.define(EDITOR, NSPanelProCardEditor);

  window.customCards = window.customCards || [];
  if (!window.customCards.some(function (c) { return c.type === CARD; })) {
    window.customCards.push({
      type: CARD,
      name: 'NSPanel Pro Card',
      description: 'Full-screen smart-home panel for Sonoff NSPanel Pro or phone: clock, weather, recuperator, AC, heat pump, solar, custom buttons.',
      preview: true,
      documentationURL: 'https://github.com/keziksdmitrijs-byte/nspanel-pro-card'
    });
  }
  if (window.console) {
    console.info('%c NSPANEL-PRO-CARD %c v' + VERSION + ' ', 'background:#3b82f6;color:#fff;font-weight:700', 'background:#1e293b;color:#fff');
  }
})();
