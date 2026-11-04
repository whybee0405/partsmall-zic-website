/**
 * Loads seed.json into the site's CloudIA CMS through its admin API (validated and published
 * like an editor's save). Re-runnable: entries upsert by slug; images upload once per product.
 *
 *   CLOUDIA_URL=http://127.0.0.1:8788 CLOUDIA_ADMIN_EMAIL=… CLOUDIA_ADMIN_PASSWORD=… \
 *     node cloudia/migration/seed-cms.mjs
 */
import { readFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const base = (process.env.CLOUDIA_URL || 'http://127.0.0.1:8788').replace(/\/$/, '')
const seed = JSON.parse(readFileSync(resolve(here, 'seed.json'), 'utf8'))

let cookie = ''
async function api(path, init = {}) {
  const response = await fetch(base + path, {
    ...init,
    headers: { ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), cookie, ...init.headers },
  })
  const setCookie = response.headers.getSetCookie?.() ?? []
  if (setCookie.length) cookie = setCookie.map((c) => c.split(';')[0]).join('; ')
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${init.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

await api('/admin/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: process.env.CLOUDIA_ADMIN_EMAIL, password: process.env.CLOUDIA_ADMIN_PASSWORD }),
})
const sites = await api('/admin/api/sites')
const site = (sites.sites ?? sites).find((s) => s.slug === 'skzic')
if (!site) throw new Error('site skzic not found')
const collections = await api(`/admin/api/sites/${site.id}/collections`)
const bySlug = Object.fromEntries((collections.collections ?? collections).map((c) => [c.slug, c]))

// Product renders -> media library. Reuse an upload with the same filename on a re-run.
const media = await api(`/admin/api/sites/${site.id}/media`)
const existing = new Map((media.media ?? media.items ?? media).map((m) => [m.filename, m]))
const products = []
for (const product of seed.products) {
  const filename = basename(product.imageFile)
  let uploaded = existing.get(filename)
  if (!uploaded) {
    const form = new FormData()
    form.append('file', new Blob([readFileSync(resolve(root, product.imageFile))], { type: 'image/webp' }), filename)
    form.append('alt', `${product.data.name} ${product.data.grade} pack`)
    uploaded = await api(`/admin/api/sites/${site.id}/media`, { method: 'POST', body: form })
    console.log(`uploaded ${filename} -> ${uploaded.path}`)
  }
  products.push({ slug: product.slug, publish: true, data: { ...product.data, image: uploaded.path ?? `/api/media/${uploaded.id}` } })
}

async function load(slug, entries) {
  const result = await api(`/admin/api/collections/${bySlug[slug].id}/import`, {
    method: 'POST',
    body: JSON.stringify({ mode: 'upsert', entries }),
  })
  console.log(`${slug}: ${JSON.stringify(result)}`)
}
await load('products', products)
await load('faqs', seed.faqs.map((f) => ({ ...f, publish: true })))
await load('company', [{ slug: 'company', data: seed.company, publish: true }])
await load('trust', [{ slug: 'trust', data: seed.trust, publish: true }])
