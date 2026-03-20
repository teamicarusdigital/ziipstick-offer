export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const handles = (req.query.handles || '').split(',').filter(Boolean);
  if (!handles.length) return res.json({});

  const results = {};

  await Promise.all(handles.map(async function(handle) {
    handle = handle.trim();
    try {
      const r = await fetch('https://ziipstick.com/products/' + handle, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const html = await r.text();
      results[handle] = {};
      // Extract variant id + available pairs from KLIP_APP_DATA
      const regex = /"id":(\d{10,}),[^}]{0,500}"available":(true|false)/g;
      let m;
      while ((m = regex.exec(html)) !== null) {
        results[handle][m[1]] = m[2] === 'true';
      }
    } catch(e) {
      results[handle] = null;
    }
  }));

  res.json(results);
}
