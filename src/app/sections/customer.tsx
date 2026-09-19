import MyCustomers from "./../components/Customer/Customer";
import TitleSection from "../components/Title-Section/Title-Section";

export default function Customer({ color }: { color: string }) {
  return (
    <section className={`${color} relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto py-20 relative z-10">
        <div>
          <TitleSection title="آراء عملائنا الكرام" />
        </div>
        
        <div className="mt-12">
          <MyCustomers />
        </div>
      </div>
    </section>
  );
}
