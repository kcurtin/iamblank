defmodule Iamblank.MessageView do
  use Iamblank.Web, :view

  def render("index.json", %{messages: messages}) do
    %{data: render_many(messages, Iamblank.MessageView, "message.json")}
  end

  def render("show.json", %{message: message}) do
    %{data: render_one(message, Iamblank.MessageView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    %{id: message.id,
      body: message.body,
      user_id: message.user_id,
      room_id: message.room_id}
  end
end
