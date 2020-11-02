import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Adding a custom getInitialProps in your App will disable Automatic Static Optimization in pages without Static Generation.
 */
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
