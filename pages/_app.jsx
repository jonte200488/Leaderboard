// pages/_app.jsx
import styles from '../styles/style.css'; // Import your global CSS file here
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  <body>
    <Navbar />
    <h1>Hello, testing</h1>
  </body>
  
  return <Component {...pageProps} />;
}

export default MyApp;