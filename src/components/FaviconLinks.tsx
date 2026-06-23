const faviconPath = '/assets/img/favicons'

export const FaviconLinks = () => (
  <>
    <link rel="apple-touch-icon" href={`${faviconPath}/apple-touch-icon.png`} />
    <link rel="icon" type="image/png" sizes="32x32" href={`${faviconPath}/mstile-32x32.png`} />
    <link rel="icon" type="image/png" sizes="16x16" href={`${faviconPath}/favicon-16x16.png`} />
    <link rel="shortcut icon" href={`${faviconPath}/favicon.ico`} />
    <link rel="manifest" href={`${faviconPath}/site.webmanifest`} />
    <meta name="msapplication-config" content={`${faviconPath}/browserconfig.xml`} />
    <meta name="msapplication-TileColor" content="#111111" />
    <meta name="theme-color" content="#111111" />
  </>
)
