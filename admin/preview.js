const UpcomingPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || '';
    const body = entry.getIn(['data', 'body']) || '';

    // Render the raw markdown body out into HTML just like Hugo does
    const htmlBody = marked.parse(body);

    // Render a structure very similar to the main site's CSS layout for accurate visualization
    return h('div', { 
      style: { 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6',
        color: '#334155',
        padding: '2rem'
      } 
    },
      h('div', {
        style: {
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '2rem',
          borderTop: '4px solid #1a365d'
        }
      },
        h('h2', { style: { marginTop: 0, color: '#1a365d', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' } }, title),
        h('div', { dangerouslySetInnerHTML: { __html: htmlBody } })
      )
    );
  }
});

CMS.registerPreviewStyle("https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css");
CMS.registerPreviewTemplate("upcoming", UpcomingPreview);
