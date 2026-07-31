import HelloWorld from "./components/HelloWorld/HelloWorld";

import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <HelloWorld name="Vitest" />
      <Button>Click me</Button>
    </>
  );
}

export default App;
