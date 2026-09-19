"use client";

const CriticalCSS = () => {
  return (
    <style jsx>{`
      /* Critical CSS for above-the-fold content */
      body {
        font-family: var(--font-almarai), system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }

      /* Critical layout styles */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      /* Critical hero styles */
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        color: white;
        text-align: center;
        padding: 2rem 1rem;
      }

      .hero h1 {
        font-size: clamp(2rem, 5vw, 4rem);
        font-weight: 700;
        margin-bottom: 1rem;
        line-height: 1.2;
      }

      .hero p {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      /* Critical button styles */
      .btn {
        display: inline-block;
        padding: 0.75rem 2rem;
        background-color: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: background-color 0.3s ease;
      }

      .btn:hover {
        background-color: #059669;
      }

      /* Critical navigation styles */
      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        z-index: 1000;
        padding: 1rem 0;
      }

      /* Critical loading styles */
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }

      .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #10b981;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Critical responsive styles */
      @media (max-width: 768px) {
        .hero {
          min-height: 80vh;
          padding: 1rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
        }
        
        .hero p {
          font-size: 1.2rem;
        }
      }

      /* Critical font loading */
      @font-face {
        font-family: 'Almarai';
        font-display: swap;
        src: url('/fonts/almarai.woff2') format('woff2');
      }

      /* Critical image styles */
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }

      /* Critical layout shifts prevention */
      .section {
        min-height: 400px;
      }

      .section img {
        aspect-ratio: 16/9;
        object-fit: cover;
      }
    `}</style>
  );
};

export default CriticalCSS;


