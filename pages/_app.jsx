// pages/_app.jsx
import '../styles/style.css'; // Import your global CSS file here
import Navbar from '../components/Navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Link to the favicon */}
        <link rel="icon" href="/Kexchoklad_logo_R.png" type="image/png" />
        <title>Buildahome CUP</title> {/* Optional: Add a title */}
      </Head>

      {/* Body content */}
      <Navbar />
      <h1>Hello, testing</h1>

      {/* Render the page component */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;