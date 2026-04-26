import Link from "next/link";
import { DashboardPage } from "@repo/ui/views/DashboardView";

export default function Home() {
  return <DashboardPage LinkComponent={Link} />;
}