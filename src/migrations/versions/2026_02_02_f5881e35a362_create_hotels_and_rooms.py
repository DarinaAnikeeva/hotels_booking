"""create hotels and rooms

Revision ID: f5881e35a362
Revises: a74f0e79e54f
Create Date: 2026-02-02 14:54:22.654384

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f5881e35a362'
down_revision: Union[str, Sequence[str], None] = 'a74f0e79e54f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('rooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('hotel_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['hotel_id'], ['hotels.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('rooms')