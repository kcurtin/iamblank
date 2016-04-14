defmodule Iamblank.User do
  use Iamblank.Web, :model

  @colors ~w(navy blue aqua teal olive green lime yellow orange red fuchsia purple maroon white silver gray black)
  @required_fields ~w(username)
  @optional_fields ~w(color)

  schema "users" do
    field :username, :string
    field :color, :string
    has_many :messages, Iamblank.Message

    timestamps
  end

  def create_user do
    [{one, two}] =
      :calendar.local_time_to_universal_time_dst(:calendar.local_time())
    nums = Tuple.to_list(one) ++ Tuple.to_list(two)
    rand_name = "user_#{Enum.join(nums)}"
    color = Enum.random(@colors)
    changeset = changeset(%__MODULE__{}, %{username: rand_name, color: color})
    Iamblank.Repo.insert!(changeset)
  end

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
