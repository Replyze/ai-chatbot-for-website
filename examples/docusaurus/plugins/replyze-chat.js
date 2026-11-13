// Adds the Replyze chat widget to every page of a Docusaurus site.
//
// The tags go into the HTML of every page at build time, right before
// </body>. Docusaurus then moves between pages without reloading, so the
// script runs once and the chat stays open across pages.
export default function replyzeChat(context, options) {
  const config = {
    token: options.token,
    apiUrl: 'https://client.replyze.chat',
  };

  return {
    name: 'replyze-chat',
    injectHtmlTags() {
      return {
        postBodyTags: [
          `<script>window.ReplyzeConfig = ${JSON.stringify(config)};</script>`,
          '<script src="https://cdn.replyze.chat/widget.js" async></script>',
        ],
      };
    },
  };
}
