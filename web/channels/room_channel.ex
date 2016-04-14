defmodule Iamblank.RoomChannel do
  use Iamblank.Web, :channel

  alias Iamblank.Room
  alias Iamblank.Message

  def join("rooms:" <> room_name, _params, socket) do
    room =
      Repo.one(
        from r in Room,
        where: r.name == ^room_name,
        preload: [messages: :user]
      )

    unless room do
      {:ok, room} =
        Repo.insert(Room.changeset(%Room{}, %{name: room_name}))

      room =
        Repo.one(
          from r in Room,
          where: r.name == ^room.name,
          preload: [messages: :user]
        )
    end

    resp = %{
       messages: Phoenix.View.render_many(
         room.messages, Iamblank.MessageView, "message.json"
       )
     }

    {:ok, resp, assign(socket, :room_id, room.id)}
  end

  def handle_in(event, params, socket) do
    user = Repo.get(Iamblank.User, socket.assigns.user_id)
    handle_in(event, params, user, socket)
  end

  def handle_in("new_message", %{"message" => message}, user, socket) do
    changeset =
      user
      |> build_assoc(:messages, room_id: socket.assigns.room_id)
      |> Iamblank.Message.changeset(message)


    case Repo.insert(changeset) do
      {:ok, message} ->
        message =
          Repo.one(
            from m in Message,
            where: m.id == ^message.id,
            preload: [:user]
          )
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
