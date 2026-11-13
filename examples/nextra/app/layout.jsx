import Script from 'next/script';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';

export const metadata = {
  title: { default: 'Example docs', template: '%s – Example docs' },
};

// Your widget token is in the Replyze dashboard:
// Settings → Integrations → Install widget.
const REPLYZE_TOKEN = 'wgt_YOUR_TOKEN';

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={<Navbar logo={<b>Example docs</b>} />}
          footer={<Footer>Example docs</Footer>}
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>

        {/* The chat widget. The root layout stays mounted when the reader
            moves between pages, so the script loads once. */}
        <Script id="replyze-config" strategy="afterInteractive">
          {`window.ReplyzeConfig = { token: '${REPLYZE_TOKEN}', apiUrl: 'https://client.replyze.chat' };`}
        </Script>
        <Script src="https://cdn.replyze.chat/widget.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
