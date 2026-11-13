import { ScrollViewStyleReset } from "expo-router/html";
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#111111" />
        <title>ALTER EGO — твоё присутствие</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html:
              "body{background:#111111}*{box-sizing:border-box}::selection{background:#C7FF00;color:#111111}button:focus-visible,[role=button]:focus-visible,[role=tab]:focus-visible{outline:2px solid #C7FF00;outline-offset:3px}input:focus,textarea:focus{outline:1px solid #B996F5!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#343434;border-radius:4px}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
