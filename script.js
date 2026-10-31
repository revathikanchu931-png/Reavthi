// IP Addressing and Subnetting Calculator
// Each calculator validates its input before producing a result.

const byId = (id) => document.getElementById(id);

function parseIPv4(address) {
  const parts = address.trim().split('.');
  if (parts.length !== 4) return { valid: false, error: 'An IPv4 address must contain exactly four octets separated by dots.' };
  const octets = [];
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return { valid: false, error: 'Each octet must contain decimal digits only.' };
    const value = Number(part);
    if (value < 0 || value > 255) return { valid: false, error: 'Each IPv4 octet must be between 0 and 255.' };
    octets.push(value);
  }
  return { valid: true, octets };
}

function ipv4ToNumber(octets) {
  return octets.reduce((value, octet) => value * 256 + octet, 0);
}

function numberToIPv4(value) {
  const octets = [];
  for (let shift = 24; shift >= 0; shift -= 8) octets.push(Math.floor(value / (2 ** shift)) % 256);
  return octets.join('.');
}

function calculateSubnet(ip, prefix) {
  const parsed = parseIPv4(ip);
  if (!parsed.valid) return parsed;
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return { valid: false, error: 'The CIDR prefix must be a whole number from 0 to 32.' };

  const ipNumber = ipv4ToNumber(parsed.octets);
  const blockSize = 2 ** (32 - prefix);
  const networkNumber = Math.floor(ipNumber / blockSize) * blockSize;
  const broadcastNumber = networkNumber + blockSize - 1;
  const maskNumber = prefix === 0 ? 0 : Math.floor(0xFFFFFFFF - (2 ** (32 - prefix) - 1));
  const wildcardNumber = 0xFFFFFFFF - maskNumber;
  const maskOctets = Array.from({ length: 4 }, (_, index) => Math.floor(maskNumber / (256 ** (3 - index))) % 256);
  const wildcardOctets = Array.from({ length: 4 }, (_, index) => Math.floor(wildcardNumber / (256 ** (3 - index))) % 256);
  const total = blockSize;

  let firstHost = 'Not applicable';
  let lastHost = 'Not applicable';
  let usable = 0;
  let note = '';
  if (prefix <= 30) {
    firstHost = numberToIPv4(networkNumber + 1);
    lastHost = numberToIPv4(broadcastNumber - 1);
    usable = total - 2;
  } else if (prefix === 31) {
    firstHost = numberToIPv4(networkNumber);
    lastHost = numberToIPv4(broadcastNumber);
    usable = 2;
    note = 'A /31 is typically used for point-to-point links; both addresses can be used as endpoints, so network and broadcast exclusions do not apply.';
  } else {
    firstHost = numberToIPv4(ipNumber);
    lastHost = numberToIPv4(ipNumber);
    usable = 1;
    note = 'A /32 identifies one address (a host route). Conventional network, broadcast and usable-host rules do not apply.';
  }

  return { valid: true, ip: parsed.octets.join('.'), prefix, mask: maskOctets.join('.'), network: numberToIPv4(networkNumber), broadcast: numberToIPv4(broadcastNumber), firstHost, lastHost, total, usable, wildcard: wildcardOctets.join('.'), note };
}

function showMessage(target, text, type) {
  target.innerHTML = `<div class="message ${type}">${escapeHTML(text)}</div>`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderSubnet(target, result) {
  if (!result.valid) {
    showMessage(target, result.error, 'error');
    return;
  }
  const rows = [
    ['IP address', result.ip], ['CIDR prefix', `/${result.prefix}`], ['Subnet mask', result.mask], ['Wildcard mask', result.wildcard],
    ['Network address', result.network], ['Broadcast address', result.broadcast], ['First usable host', result.firstHost], ['Last usable host', result.lastHost],
    ['Total addresses', result.total.toLocaleString('en-US')], ['Usable hosts', result.usable.toLocaleString('en-US')]
  ];
  target.innerHTML = `<div class="result-grid">${rows.map(([label, value]) => `<div class="result-item"><span class="result-label">${label}</span><span class="result-value">${escapeHTML(value)}</span></div>`).join('')}${result.note ? `<p class="result-note">${escapeHTML(result.note)}</p>` : ''}</div>`;
}

function isValidIPv6(input) {
  const address = input.trim();
  if (!address || address.includes('%')) return false;
  const doubleColonParts = address.split('::');
  if (doubleColonParts.length > 2) return false;
  const compressed = doubleColonParts.length === 2;
  const groups = address.split(':');
  let ipv4TailGroups = 0;
  if (address.includes('.')) {
    const lastColon = address.lastIndexOf(':');
    if (lastColon < 0) return false;
    const parsedTail = parseIPv4(address.slice(lastColon + 1));
    if (!parsedTail.valid) return false;
    // An IPv4 tail uses the place of the final two 16-bit groups.
    groups.splice(groups.length - 1, 1);
    ipv4TailGroups = 2;
  }
  if (compressed) {
    const [left, right] = address.split('::');
    const explicitGroups = [...(left ? left.split(':') : []), ...(right ? right.split(':') : [])];
    if (explicitGroups.some((group) => group === '')) return false;
  } else if (groups.some((group) => group === '')) {
    return false;
  }
  const hexGroups = groups.filter((group) => group !== '');
  if (hexGroups.some((group) => !/^[\da-fA-F]{1,4}$/.test(group))) return false;
  const count = hexGroups.length + ipv4TailGroups;
  return compressed ? count < 8 : count === 8;
}

byId('ipv4-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const result = parseIPv4(byId('ipv4-input').value);
  showMessage(byId('ipv4-result'), result.valid ? `Valid IPv4 address: ${result.octets.join('.')}` : result.error, result.valid ? 'success' : 'error');
});

byId('subnet-form').addEventListener('submit', (event) => {
  event.preventDefault();
  renderSubnet(byId('subnet-result'), calculateSubnet(byId('subnet-ip').value, Number(byId('subnet-prefix').value)));
});

byId('cidr-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = byId('cidr-input').value.trim();
  const parts = value.split('/');
  if (parts.length !== 2 || !/^\d+$/.test(parts[1])) {
    showMessage(byId('cidr-result'), 'Enter CIDR as an IPv4 address followed by / and a prefix from 0 to 32.', 'error');
    return;
  }
  renderSubnet(byId('cidr-result'), calculateSubnet(parts[0], Number(parts[1])));
});

byId('ipv6-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = byId('ipv6-input').value.trim();
  const valid = isValidIPv6(value);
  showMessage(byId('ipv6-result'), valid ? `Valid IPv6 address: ${value}` : 'Invalid IPv6 format. Use eight hexadecimal groups, or compress one or more zero groups with ::.', valid ? 'success' : 'error');
});

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('reset', () => {
    const result = form.parentElement.querySelector('[aria-live="polite"]');
    if (result) result.innerHTML = '';
    window.setTimeout(() => {
      form.querySelectorAll('input').forEach((input) => input.setCustomValidity(''));
    }, 0);
  });
});

const menuToggle = byId('menu-toggle');
const navigation = byId('main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
