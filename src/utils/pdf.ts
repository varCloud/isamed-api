import puppeteer from 'puppeteer';

const getPuppeteerOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };

  if (process.platform === 'win32' && !isProduction) {
    return {
      ...defaultOptions,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    };
  }

  return defaultOptions;
};

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch(getPuppeteerOptions());

  const page = await browser.newPage();

  await page.emulateMediaType('screen');

  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110 Safari/537.36'
  );
  await page.setViewport({ width: 1240, height: 1754 }); // aprox. A4 a 96dpi

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0cm',
      bottom: '0cm',
      left: '0cm',
      right: '0cm',
    },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}
