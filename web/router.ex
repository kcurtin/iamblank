defmodule Iamblank.Router do
  use Iamblank.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Iamblank.Auth, repo: Iamblank.Repo
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Iamblank.Auth, repo: Iamblank.Repo
  end

  scope "/", Iamblank do
    pipe_through :browser # Use the default browser stack
    get "/", PageController, :index
  end


  scope "/api", Iamblank do
    pipe_through :api
    resources "/users", UserController, except: [:new, :edit]
    resources "/rooms", RoomController, except: [:new, :edit]
    resources "/messages", MessageController, except: [:new, :edit]
  end
end
