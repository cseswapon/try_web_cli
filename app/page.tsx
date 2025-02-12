import TerminalComponent from "@/components/Terminal";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Web CLI</h1>
      <TerminalComponent />
    </div>
  );
}
