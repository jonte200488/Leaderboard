// pages/_app.jsx
import './styles/style.css'; // Import your global CSS file here

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;