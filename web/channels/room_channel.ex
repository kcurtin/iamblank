defmodule Iamblank.RoomChannel do
  use Phoenix.Channel

  # intercept ["join_room"]

  def join("rooms:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("rooms:" <> _private_room_id, _params, socket) do
    # TODO: Find room based on _private_room_id

    comments = [
      %{id: 1, author: "Kevin", body: "This is a great comment"},
      %{id: 2, author: "Lauren", body: "Wow, what a good reply"}
    ]
    reply = %{comments: comments}
    socket = assign(socket, :comments, comments)
    {:ok, reply, socket}
  end

  def handle_in("join_room", %{"body" => body}, socket) do
    broadcast! socket, "join_room", %{body: body}
    {:noreply, socket}
  end

  def handle_out("join_room", payload, socket) do
    push socket, "join_room", payload
    {:noreply, socket}
  end

  def handle_in("new_comment", %{"comment" => comment}, socket) do
    new_comment = %{id: 3, author: comment["author"], body: comment["body"]}
    comments = socket.assigns.comments
    new_comments = List.insert_at(comments, -1, new_comment)
    socket = assign(socket, :comments, new_comments)
    broadcast! socket, "new_comment", %{comments: new_comments}
    {:noreply, socket}
  end

  def handle_out("new_comment", payload, socket) do
    push socket, "new_comment", payload
    {:noreply, socket}
  end
end
