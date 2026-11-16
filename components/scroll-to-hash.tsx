"use client";

import { useEffect } from "react";

// The add forms stream in behind Suspense, so the target isn't in the DOM
// when the browser tries to honor a link like /assignments#add-assignment.
// Mount this next to the target to scroll once it exists.
export default function ScrollToHash({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [id]);
  return null;
}
