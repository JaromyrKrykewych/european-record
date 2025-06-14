import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 rounded-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">European Club Stats</div>
        <div className="space-x-6">
          <Link href="/" className="text-blue-500 hover:underline">
            All Teams Standings
          </Link>
          <Link href="/personalized" className="text-blue-500 hover:underline">
            Personalized Table
          </Link>
          <Link href="/crosstable" className="text-blue-500 hover:underline">
            Global Head-to-Head
          </Link>
          <Link href="/progression" className="text-blue-500 hover:underline">
            Progression Table
          </Link>
          <Link href="/update" className="text-blue-500 hover:underline">
            Update Data
          </Link>
        </div>
      </div>
    </nav>
  );
};
