// pages/_app.jsx
import '../styles/style.css'; // Import your global CSS file here

function MyApp({ Component, pageProps }) {
  <h1>Hello, testing</h1>
  return <Component {...pageProps} />;
}

export default MyApp;