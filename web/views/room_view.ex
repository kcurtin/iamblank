defmodule Iamblank.RoomView do
  use Iamblank.Web, :view

  def render("index.json", %{rooms: rooms}) do
    %{data: render_many(rooms, Iamblank.RoomView, "room.json")}
  end

  def render("show.json", %{room: room}) do
    %{data: render_one(room, Iamblank.RoomView, "room.json")}
  end

  def render("room.json", %{room: room}) do
    %{id: room.id, name: room.name}
  end
end
