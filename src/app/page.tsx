import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Input />
      <Button className="bg-green-950 dark:bg-green-400">Hello</Button>
      <DarkModeToggle />
    </div>
  );
}
