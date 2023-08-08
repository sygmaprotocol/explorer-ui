import { useEffect, useState } from "react";

export default function useClipboard(){
  const [clipboardMessageT1, setClipboardMessageT1] =
  useState<string>("Copy to clipboard");

const [clipboardMessageT2, setClipboardMessageT2] =
  useState<string>("Copy to clipboard");

  useEffect(() => {
    let timerT1: ReturnType<typeof setTimeout>;
    let timerT2: ReturnType<typeof setTimeout>;

    if (clipboardMessageT1 === "Copied to clipboard!") {
      timerT1 = setTimeout(() => {
        setClipboardMessageT1("Copy to clipboard");
      }, 1000);
    } else if (clipboardMessageT2 === "Copied to clipboard!") {
      timerT2 = setTimeout(() => {
        setClipboardMessageT2("Copy to clipboard");
      }, 1000);
    }

    return () => {
      clearTimeout(timerT1);
      clearTimeout(timerT2);
    };
  }, [clipboardMessageT1, clipboardMessageT2]);

  return { clipboardMessageT1, setClipboardMessageT1, clipboardMessageT2, setClipboardMessageT2 }

}