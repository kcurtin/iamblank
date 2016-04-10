defmodule Iamblank.Session do
  def current_user(conn) do
    case Plug.Conn.get_session(conn, :current_user) do
      nil -> Iamblank.User.create_user
      id -> Iamblank.Repo.get(Iamblank.User, id)
    end
  end
end
