defmodule Iamblank.RoomChannel do
  use Iamblank.Web, :channel

  alias Iamblank.Room

  def join("rooms:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("rooms:" <> room_name, _params, socket) do
    room =
      Repo.one(
        from r in Room,
        where: r.name == ^room_name,
        preload: [:messages]
      )

    reply = %{messages: room.messages}
    socket = assign(socket, :messages, room.messages)
    {:ok, reply, socket}
  end

  def handle_in("join_room", %{"body" => body}, socket) do
    broadcast! socket, "join_room", %{body: body}
    {:noreply, socket}
  end

  def handle_in("new_message", %{"message" => message}, socket) do
    new_message = %{id: 3, user: message["user"], body: message["body"]}
    messages = socket.assigns.messages
    new_messages = List.insert_at(messages, -1, new_message)
    socket = assign(socket, :messages, new_messages)
    broadcast! socket, "new_message", %{messages: new_messages}
    {:noreply, socket}
  end
end
