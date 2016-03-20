defmodule Iamblank.PageController do
  use Iamblank.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
