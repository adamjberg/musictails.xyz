import { Link } from "@remix-run/react";
import React from "react";

export default function Index() {
  return <div>
    <h1>Homepage</h1>
    <Link to={"/kaizen/2024-04-22"}>2024-04-22</Link>
  </div>;
}