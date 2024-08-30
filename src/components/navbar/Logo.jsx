import Link from "next/link";

function Logo () {
  return (
    <div>
      <Link href="/" className="text-2xl font-semibold dark:text-white">
        Collab
        <span className="text-3xl text-rose-500">
          Chron
        </span>
      </Link>
    </div>
  );
};

export default Logo;
