defmodule Iamblank.PageController do
  use Iamblank.Web, :controller

  def index(conn, _params) do
    case Iamblank.Session.current_user(conn) do
      user ->
        conn
        |> put_session(:current_user, user.id)
        |> put_flash(:info, "Logged in")
        |> render("index.html")
    end
  end
end
