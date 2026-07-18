/* ============================================================
   SampTA — Organizers' CMS preview (upcoming conference)
   ------------------------------------------------------------
   Renders the CMS preview using the SAME stylesheet and markup
   structure as the live site, so organizers see what visitors
   will actually get. Kept deliberately consistent with the
   master admin preview in the SampTA repo.

   Notes for maintainers:
   - We load the LIVE production stylesheet (from sampta.org) so
     the preview matches production, not a generic reset.
   - The live /upcoming/ page renders the body inside
     <main><div class="container"><div class="content-body">…
     (see the SampTA repo: layouts/upcoming/single.html). The
     front-matter title is NOT shown on the page, so we don't
     render it here either — this keeps the preview honest.
   - Keep tables and other raw HTML in "Markdown" mode; the
     rich-text editor can mangle raw HTML.
   ============================================================ */

var SITE_CSS = "https://sampta.org/css/style.css";

function normalizeUrl(value) {
  return String(value || '').replace(/[\u0000-\u0020\u007f\s]+/g, '').toLowerCase();
}

function isSafeUrl(value) {
  var normalized = normalizeUrl(value);

  return (
    normalized === '' ||
    normalized.startsWith('#') ||
    normalized.startsWith('/') ||
    normalized.startsWith('./') ||
    normalized.startsWith('../') ||
    normalized.startsWith('http:') ||
    normalized.startsWith('https:') ||
    normalized.startsWith('mailto:') ||
    normalized.startsWith('tel:') ||
    normalized.startsWith('blob:') ||
    normalized.startsWith('data:image/')
  );
}

function sanitizeHtml(html) {
  var template = document.createElement('template');
  template.innerHTML = html;

  template.content.querySelectorAll('script, iframe, object, embed, form, input, button, textarea, select, meta, link, base').forEach(function (node) {
    node.remove();
  });

  template.content.querySelectorAll('*').forEach(function (element) {
    Array.from(element.attributes).forEach(function (attr) {
      var name = attr.name.toLowerCase();
      var value = attr.value;

      if (name.startsWith('on') || name === 'srcdoc') {
        element.removeAttribute(attr.name);
        return;
      }

      if (name === 'style' && /expression\s*\(|url\s*\(\s*['"]?\s*javascript:/i.test(value)) {
        element.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src' || name === 'xlink:href' || name === 'action' || name === 'formaction') && !isSafeUrl(value)) {
        element.setAttribute(attr.name, '#');
      }
    });
  });

  return template.innerHTML;
}

// A small, clearly-marked editor hint. Inline-styled so it never
// depends on (or is restyled by) the site CSS, and so it can't be
// mistaken for page content.
function editorHint() {
  return h('div', {
    style: {
      position: 'sticky', top: 0, zIndex: 20,
      background: '#fff8db', borderBottom: '1px solid #e6d97a',
      color: '#5c4d00', font: '13px/1.45 system-ui, -apple-system, sans-serif',
      padding: '8px 14px'
    }
  }, 'Editor preview — this narrow pane triggers the site’s mobile layout; the live desktop site is wider. The Title field is used as metadata and is not shown on the page. Keep any tables/raw HTML in “Markdown” mode.');
}

const UpcomingPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const body = entry.getIn(['data', 'body']) || '';
    const htmlBody = sanitizeHtml(marked.parse(body));

    return h('div', {},
      editorHint(),
      // Mirror layouts/upcoming/single.html on the main site.
      h('main', {},
        h('div', { className: 'container' },
          h('div', { className: 'content-body' },
            h('div', { dangerouslySetInnerHTML: { __html: htmlBody } })
          )
        )
      )
    );
  }
});

// Load the LIVE site stylesheet so the preview matches production.
CMS.registerPreviewStyle(SITE_CSS);
CMS.registerPreviewTemplate("upcoming", UpcomingPreview);
