defmodule Iamblank.Message do
  use Iamblank.Web, :model

  schema "messages" do
    field :body, :string
    belongs_to :user, Iamblank.User
    belongs_to :room, Iamblank.Room

    timestamps
  end

  @required_fields ~w(body)
  @optional_fields ~w(room_id)

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
