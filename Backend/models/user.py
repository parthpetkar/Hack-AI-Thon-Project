from werkzeug.security import generate_password_hash, check_password_hash
from database.connection import Neo4jConnection
from datetime import datetime

class User:
    def __init__(self, email, password_hash, mobile, name, created_at=None):
        self.email = email
        self.password_hash = password_hash
        self.mobile = mobile
        self.name = name
        self.created_at = created_at

    @staticmethod
    def create_user(email, password, mobile, name):
        db = Neo4jConnection()
        with db.get_session() as session:
            # Check if user already exists
            result = session.run(
                "MATCH (u:User {email: $email}) RETURN u",
                email=email
            )
            if result.single():
                return None

            password_hash = generate_password_hash(password)
            # Use Neo4j's timestamp() function to store creation time
            result = session.run(
                """
                CREATE (u:User {
                    email: $email,
                    password_hash: $password_hash,
                    mobile: $mobile,
                    name: $name,
                    created_at: datetime()
                })
                RETURN u
                """,
                email=email,
                password_hash=password_hash,
                mobile=mobile,
                name=name
            )
            user_data = result.single()['u']
            return User(
                email,
                password_hash,
                mobile,
                name,
                user_data['created_at']
            )

    @staticmethod
    def get_user_by_email(email):
        db = Neo4jConnection()
        with db.get_session() as session:
            result = session.run(
                "MATCH (u:User {email: $email}) RETURN u",
                email=email
            )
            user = result.single()
            if user:
                user = user['u']
                return User(
                    user['email'],
                    user['password_hash'],
                    user['mobile'],
                    user['name'],
                    user['created_at']
                )
            return None

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)