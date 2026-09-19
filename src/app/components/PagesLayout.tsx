import Navbar from "./Header/Navbar";
import Footer from "../sections/footer";
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
