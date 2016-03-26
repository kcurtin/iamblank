defmodule Iamblank.UserView do
  use Iamblank.Web, :view

  def render("index.json", %{users: users}) do
    %{data: render_many(users, Iamblank.UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, Iamblank.UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      username: user.username}
  end
end
