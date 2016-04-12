import "phoenix_html"
import React from "react"
import ReactDOM from "react-dom"

import socket from "./socket"
import RoomBox from "./RoomBox"

ReactDOM.render(
  <RoomBox socket={socket}/>,
  document.getElementById("room-box")
)
