const axios = require('axios');

function normalizeUrl(input) {
  if (!input) return '';
  try {
    new URL(input);
    return input;
  } catch {
    return `https://${input}`;
  }
}

// summary extraction up to maxChars
function compressToSentences(text, maxChars = 600) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]/g) || [clean];
  let out = '';
  for (const s of sentences) {
    if ((out + s).length > maxChars) break;
    out += s;
  }
  return out || clean.slice(0, maxChars);
}

async function summarizeUrl(url) {
  const normalized = normalizeUrl(url);
  // Jina Reader proxy to get readable content
  const readerUrl = `https://r.jina.ai/${normalized}`;
  try {
    const { data } = await axios.get(readerUrl, { timeout: 12000 });
    return compressToSentences(data, 700);
  } catch (err) {
    return '';
  }
}

async function fetchTitleAndFavicon(url) {
  const normalized = normalizeUrl(url);
  try {
    const { data: html } = await axios.get(normalized, { timeout: 10000 });
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : normalized;

    const faviconMatch = html.match(/<link[^>]*rel=["']?[^"']*icon[^"']*["']?[^>]*href=["']([^"']+)["'][^>]*>/i);
    let favicon = '';
    if (faviconMatch && faviconMatch[1]) {
      try {
        const u = new URL(faviconMatch[1], normalized);
        favicon = u.href;
      } catch {}
    }
    return { title, favicon };
  } catch {
    return { title: normalized, favicon: '' };
  }
}

module.exports = { summarizeUrl, fetchTitleAndFavicon, normalizeUrl };
