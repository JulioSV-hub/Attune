// Gera o PDF de cada e-book (ebooks/*.html) a partir da própria página, no modo de impressão.
// Uso: npm run pdf:ebooks   (precisa do Microsoft Edge ou do Chrome instalado)
// Navegador: variável BROWSER_PATH, ou o caminho padrão do Edge no Windows.
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');
const { PDFDocument } = require('pdf-lib');

const RAIZ = path.resolve(__dirname, '..');
const NAVEGADOR = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };

// Servidor local mínimo, para a página carregar CSS e imagens como no site.
function servir() {
  const server = http.createServer((req, res) => {
    const arquivo = path.join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!arquivo.startsWith(RAIZ) || !fs.existsSync(arquivo) || fs.statSync(arquivo).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    fs.createReadStream(arquivo).pipe(res);
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server)));
}

(async () => {
  const server = await servir();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({ executablePath: NAVEGADOR, headless: 'new' });
  try {
    const ebooks = fs.readdirSync(path.join(RAIZ, 'ebooks')).filter(f => f.endsWith('.html'));
    for (const nome of ebooks) {
      const page = await browser.newPage();
      await page.goto(`${base}/ebooks/${nome}`, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');
      const titulo = (await page.$eval('h1', e => e.textContent.trim())).replace(/[<>&]/g, '');
      const autora = (await page.$eval('.capa p.font-bold', e => e.textContent.trim())).replace(/[<>&]/g, '');
      const comum = { preferCSSPageSize: true, printBackground: true };
      // Capa sem rodapé; demais páginas com título e número da página.
      const capa = await page.pdf({ ...comum, pageRanges: '1' });
      const miolo = await page.pdf({
        ...comum, pageRanges: '2-', displayHeaderFooter: true, headerTemplate: '<div></div>',
        footerTemplate: `<div style="width:100%;font-size:8px;color:#6b7280;font-family:Inter,sans-serif;padding:0 16mm;display:flex;justify-content:space-between"><span>${titulo} · ${autora}</span><span class="pageNumber"></span></div>`,
      });
      const pdf = await PDFDocument.create();
      for (const parte of [capa, miolo]) {
        const doc = await PDFDocument.load(parte);
        (await pdf.copyPages(doc, doc.getPageIndices())).forEach(p => pdf.addPage(p));
      }
      pdf.setTitle(titulo);
      pdf.setAuthor(autora);
      pdf.setLanguage('pt-BR');
      const destino = path.join(RAIZ, 'ebooks', nome.replace(/\.html$/, '.pdf'));
      fs.writeFileSync(destino, await pdf.save());
      console.log(`${path.relative(RAIZ, destino)}: ${pdf.getPageCount()} páginas, ${Math.round(fs.statSync(destino).size / 1024)} KB`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
})();
