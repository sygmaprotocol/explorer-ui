import { useEffect } from "react"
import { DetailViewActions, DetailViewState } from "../reducer"

export default function useClipboard(state: DetailViewState, dispatcher: React.Dispatch<DetailViewActions>): void {
  useEffect(() => {
    let timerT1: ReturnType<typeof setTimeout>
    let timerT2: ReturnType<typeof setTimeout>

    if (state.clipboardMessageT1 === "Copied to clipboard!") {
      timerT1 = setTimeout(() => {
        dispatcher({
          type: "set_clipboard_message_t1",
          payload: "Copy to clipboard",
        })
      }, 1000)
    } else if (state.clipboardMessageT2 === "Copied to clipboard!") {
      timerT2 = setTimeout(() => {
        dispatcher({
          type: "set_clipboard_message_t2",
          payload: "Copy to clipboard",
        })
      }, 1000)
    }

    return () => {
      clearTimeout(timerT1)
      clearTimeout(timerT2)
    }
  }, [state.clipboardMessageT1, state.clipboardMessageT2])
}
