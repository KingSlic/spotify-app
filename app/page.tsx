import SectionTitle from "./components/SectionTitle";

export default function Home() {
  return (
    <div className="p-6">
      <SectionTitle title="Recently Played" active={true} />
      <p>This is the Home page content area.</p>
    </div>
  );
}
