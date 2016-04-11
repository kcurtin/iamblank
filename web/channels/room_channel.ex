defmodule Iamblank.RoomChannel do
  use Iamblank.Web, :channel

  alias Iamblank.Room
  alias Iamblank.Message

  def join("rooms:" <> room_name, _params, socket) do
    room =
      Repo.one(
        from r in Room,
        where: r.name == ^room_name,
        preload: [:messages]
      )

    unless room do
      {:ok, room} = Repo.insert(Room.changeset(%Room{}, %{name: room_name}))
      Repo.preload(room, :messages)
    end

    resp = %{
       messages: Phoenix.View.render_many(
         room.messages, Iamblank.MessageView, "message.json"
       )
     }

    {:ok, resp, assign(socket, :room_id, room.id)}
  end

  def handle_in("new_message", %{"message" => message}, socket) do
    params = Map.put(message, "room_id", socket.assigns.room_id)
    changeset = Message.changeset(%Message{}, params)

    case Repo.insert(changeset) do
      {:ok, message} ->
        msg = Phoenix.View.render(
          Iamblank.MessageView, "message.json", %{message: message}
        )
        broadcast! socket, "new_message", msg
        {:reply, :ok, socket}
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end
end
