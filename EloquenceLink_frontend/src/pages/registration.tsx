import { Administration } from "@/components/Administration";
import { Chat } from "@/components/Chat";
import Login from "@/components/Login";
import Registration from "@/components/Registration";
import { BrowserRouter as Router, Routes , Route} from "react-router-dom";

export default function Home() {
  return (
    <main>
       <Registration />
    </main>
  );
}
