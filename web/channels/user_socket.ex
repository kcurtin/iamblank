defmodule Iamblank.UserSocket do
  use Phoenix.Socket

  channel "rooms:*", Iamblank.RoomChannel

  transport :websocket, Phoenix.Transports.WebSocket, timeout: 45_000

  def connect(%{"token" => id}, socket) do
    {:ok, assign(socket, :user_id, id)}
  end

  # def id(socket), do: "users_socket:#{socket.assigns.user_id}"
  def id(_socket), do: nil

end
