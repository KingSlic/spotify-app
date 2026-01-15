import os

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all ORM models."""


db = SQLAlchemy(model_class=Base)


def init_db(app):
    """Initialize Flask-SQLAlchemy with sane defaults.

    Call this from your app factory if/when you move off the fake DB.
    """

    app.config.setdefault(
        "SQLALCHEMY_DATABASE_URI",
        os.getenv("DATABASE_URL", "sqlite:///app.db"),
    )
    app.config.setdefault("SQLALCHEMY_TRACK_MODIFICATIONS", False)
    db.init_app(app)
