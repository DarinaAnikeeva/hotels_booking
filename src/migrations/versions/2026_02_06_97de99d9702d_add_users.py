"""add users

Revision ID: 97de99d9702d
Revises: f5881e35a362
Create Date: 2026-02-06 17:17:38.683778

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "97de99d9702d"
down_revision: Union[str, Sequence[str], None] = "f5881e35a362"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("firsname", sa.String(length=100), nullable=False),
        sa.Column("lastname", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("hashed_password", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("users")