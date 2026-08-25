import { Home as HomeComp } from "./components/Home/Home";
import HomeProviders from "./components/HomeProviders";

export default function HomePage() {
  return (
    <HomeProviders>
      <HomeComp />
    </HomeProviders>
  );
}
