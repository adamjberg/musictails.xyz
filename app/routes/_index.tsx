import { Link } from "@remix-run/react";
import React from "react";

export default function Index() {
  return <div>
    <h1>Homepage</h1>
    <div><Link to={"/2024-05-02-animating-sound-amplitude-and-pitch"}>Animating Sound: Amplitude & Pitch</Link></div>
    <div><Link to={"/2024-04-22-animating-sound-amplitude"}>Animating Sound: Amplitude</Link></div>
  </div>;
}
