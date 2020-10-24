import { useEffect, useState } from "react";
import buildClient from "../api/build-client";
import Link from "next/link";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);

  console.log("currentUser", currentUser);
  useEffect(() => {
    async function fetchData() {
      const client = buildClient(null);
      const response = await client.get("/api/users/currentuser");
      setCurrentUser(response.data.currentUser);
    }
    fetchData();
  }, []);

  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
