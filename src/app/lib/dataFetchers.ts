export async function fetchHeroData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/hero`);
    if (!res.ok) {
      throw new Error('Failed to fetch hero data');
    }
    return res.json();
  }
  
  export async function fetchAboutUsData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/about-us`);
    if (!res.ok) {
      throw new Error('Failed to fetch about us data');
    }
    return res.json();
  }