defmodule Iamblank.User do
  use Iamblank.Web, :model

  schema "users" do
    field :username, :string
    has_many :messages, Iamblank.Message

    timestamps
  end

  def create_user do
    [{one, two}] =
      :calendar.local_time_to_universal_time_dst(:calendar.local_time())
    nums = Tuple.to_list(one) ++ Tuple.to_list(two)
    rand_name = "user_#{Enum.join(nums)}"
    changeset = changeset(%__MODULE__{}, %{username: rand_name})
    Iamblank.Repo.insert!(changeset)
  end

  @required_fields ~w(username)
  @optional_fields ~w()

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
