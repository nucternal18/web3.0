import {
  Navbar,
  Footer,
  Loader,
  Welcome,
  Services,
  Transactions,
} from "../components";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}
