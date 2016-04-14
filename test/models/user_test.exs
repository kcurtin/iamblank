defmodule Iamblank.UserTest do
  use Iamblank.ModelCase

  alias Iamblank.User

  @valid_attrs %{username: "some content"}
  @invalid_attrs %{}

  test "create_user" do
    # user = User.create_user
    # assert user.name =~ "user"
    # assert user.color == "navy"
  end
end
