// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let channel = socket.channel("rooms:lobby", {})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })


channel.on("new_msg", payload => {
  console.log(`${payload.body}`)
})

import React from "react"
import ReactDOM from "react-dom"

var IAmBlank = React.createClass({
  getInitialState: function() {
    var assignUserToken = function() {
      return "testing-1"
    }
    return {iAm: assignUserToken(), text: ""}
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value})
    channel.push("new_msg", {body: this.state.text})
  },
  render() {
    return (
      <input
        type="text"
        value={this.state.text}
        onChange={this.handleTextChange}
      />
    )
  }
})

ReactDOM.render(
  <IAmBlank/>,
  document.getElementById("i-am-blank")
)
