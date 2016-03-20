defmodule Iamblank.RoomChannel do
  use Phoenix.Channel

  # intercept ["join_room"]

  def join("rooms:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("rooms:" <> _private_room_id, _params, socket) do
    # TODO: Find room based on _private_room_id

    messages = [
      %{id: 1, author: "Kevin", body: "This is a great message"},
      %{id: 2, author: "Lauren", body: "Wow, what a good reply"}
    ]
    reply = %{messages: messages}
    socket = assign(socket, :messages, messages)
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

  def handle_in("new_message", %{"message" => message}, socket) do
    new_message = %{id: 3, author: message["author"], body: message["body"]}
    messages = socket.assigns.messages
    new_messages = List.insert_at(messages, -1, new_message)
    socket = assign(socket, :messages, new_messages)
    broadcast! socket, "new_message", %{messages: new_messages}
    {:noreply, socket}
  end

  def handle_out("new_message", payload, socket) do
    push socket, "new_message", payload
    {:noreply, socket}
  end
end
