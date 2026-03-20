export default async function handler(req, res) {
  try {
    const r = await fetch('https://ziipstick.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    let html = await r.text();

    // Rewrite root-relative paths to absolute Shopify URLs
    // so the browser fetches all assets/links directly from ziipstick.com
    html = html.replace(/(href|src|action)="\/(?!\/)/g, '$1="https://ziipstick.com/');
    html = html.replace(/(href|src|action)='\/(?!\/)/g, "$1='https://ziipstick.com/");

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
}
