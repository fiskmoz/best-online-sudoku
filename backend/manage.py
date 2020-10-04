"""
Manage migrations
Mose used commands include:
- py manage.py db init (first time setup)
- py manage.py db migrate (make migration)
- py manage.py db upgrade (apply migration to db)
- py manage.py db --help
"""
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import app, db

MIGRATE = Migrate(app, db)
MANAGER = Manager(app)

MANAGER.add_command('db', MigrateCommand)


if __name__ == '__main__':
    MANAGER.run()
