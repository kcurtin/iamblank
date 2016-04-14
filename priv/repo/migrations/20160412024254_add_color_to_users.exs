defmodule Iamblank.Repo.Migrations.AddColorToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :color, :string
    end
  end
end
