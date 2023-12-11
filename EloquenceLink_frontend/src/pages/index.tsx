import { Administration } from "@/components/Administration";
import { Chat } from "@/components/Chat";
import Login from "@/components/Login";
import { BrowserRouter as Router, Routes , Route} from "react-router-dom";

export default function Home() {
  return (
    <main>
       <Login />
    </main>
  );
}
