from database.connection import Neo4jConnection
from datetime import datetime
import json

class Application:
    def __init__(self, application_id, user_email, vehicle_details, personal_info, policy_details, status="PENDING"):
        self.application_id = application_id
        self.user_email = user_email
        self.vehicle_details = vehicle_details
        self.personal_info = personal_info
        self.policy_details = policy_details
        self.status = status

    @staticmethod
    def create_application(user_email, data):
        db = Neo4jConnection()
        with db.get_session() as session:
            # Create the application with a timestamp-based ID
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            application_id = f"APP{timestamp}"

            # Store all properties as flat key-value pairs
            application_data = {
                "application_id": application_id,
                "status": "PENDING",
                # Vehicle details
                "vehicle_type": data["vehicleType"],
                "registration_number": data["registrationNumber"],
                "make": data["make"],
                "model": data["model"],
                "year": data["year"],
                # Personal info
                "applicant_name": data["name"],
                "mobile": data["mobile"],
                "email": data["email"],
                "address": data["address"],
                "city": data["city"],
                "state": data["state"],
                # Policy details
                "idv": data["idv"],
                "ncb": data["ncb"],
                "addons": json.dumps(data["addons"]),  # Convert list to JSON string
                "policy_annual_premium": data["policy_annual_premium"],
                "umbrella_limit": data["umbrella_limit"],
                "policy_csl": data["policy_csl"],
                "total_insurance_amount": data["total_insurance_amount"],
                # Timestamps
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }

            # Create application node and relationship with user
            result = session.run("""
                MATCH (u:User {email: $user_email})
                CREATE (a:Application)
                SET a = $application_data
                CREATE (u)-[:INSURANCE]->(a)
                RETURN a
                """,
                user_email=user_email,
                application_data=application_data
            )
            
            application_data = result.single()
            if application_data:
                app = application_data['a']
                # Reconstruct the structured data
                vehicle_details = {
                    "vehicleType": app["vehicle_type"],
                    "registrationNumber": app["registration_number"],
                    "make": app["make"],
                    "model": app["model"],
                    "year": app["year"]
                }
                personal_info = {
                    "name": app["applicant_name"],
                    "mobile": app["mobile"],
                    "email": app["email"],
                    "address": app["address"],
                    "city": app["city"],
                    "state": app["state"]
                }
                policy_details = {
                    "idv": app["idv"],
                    "ncb": app["ncb"],
                    "addons": json.loads(app["addons"]),
                    "policy_annual_premium": data["policy_annual_premium"],
                    "umbrella_limit": data["umbrella_limit"],
                    "policy_csl": data["policy_csl"],
                    "total_insurance_amount": data["total_insurance_amount"]
                }
                return Application(
                    app["application_id"],
                    user_email,
                    vehicle_details,
                    personal_info,
                    policy_details,
                    app["status"]
                )
            return None

    @staticmethod
    def get_application_by_id(application_id):
        db = Neo4jConnection()
        with db.get_session() as session:
            result = session.run("""
                MATCH (a:Application {application_id: $application_id})
                RETURN a
                """,
                application_id=application_id
            )
            app_data = result.single()
            if app_data:
                app = app_data['a']
                # Reconstruct the structured data
                vehicle_details = {
                    "vehicleType": app["vehicle_type"],
                    "registrationNumber": app["registration_number"],
                    "make": app["make"],
                    "model": app["model"],
                    "year": app["year"]
                }
                personal_info = {
                    "name": app["applicant_name"],
                    "mobile": app["mobile"],
                    "email": app["email"],
                    "address": app["address"],
                    "city": app["city"],
                    "state": app["state"]
                }
                policy_details = {
                    "idv": app["idv"],
                    "ncb": app["ncb"],
                    "addons": json.loads(app["addons"])
                }
                policy_details = {
                    "idv": app["idv"],
                    "ncb": app["ncb"],
                    "addons": json.loads(app["addons"]),
                    "policy_annual_premium": app["policy_annual_premium"],
                    "umbrella_limit": app["umbrella_limit"],
                    "policy_csl": app["policy_csl"],
                    "total_insurance_amount": app["total_insurance_amount"]
                }
                return Application(
                    app["application_id"],
                    None,
                    vehicle_details,
                    personal_info,
                    policy_details,
                    app["status"]
                )
            return None

    @staticmethod
    def get_applications_by_user(user_email):
        db = Neo4jConnection()
        with db.get_session() as session:
            result = session.run("""
                MATCH (u:User {email: $user_email})-[:INSURANCE]->(a:Application)
                RETURN a
                ORDER BY a.created_at DESC
                """,
                user_email=user_email
            )
            applications = []
            for record in result:
                app = record['a']
                # Reconstruct the structured data
                vehicle_details = {
                    "vehicleType": app["vehicle_type"],
                    "registrationNumber": app["registration_number"],
                    "make": app["make"],
                    "model": app["model"],
                    "year": app["year"]
                }
                personal_info = {
                    "name": app["applicant_name"],
                    "mobile": app["mobile"],
                    "email": app["email"],
                    "address": app["address"],
                    "city": app["city"],
                    "state": app["state"]
                }
                policy_details = {
                    "idv": app["idv"],
                    "ncb": app["ncb"],
                    "addons": json.loads(app["addons"]),
                    "policy_annual_premium": app["policy_annual_premium"],
                    "umbrella_limit": app["umbrella_limit"],
                    "policy_csl": app["policy_csl"],
                    "total_insurance_amount": app["total_insurance_amount"]
                }
                applications.append(Application(
                    app["application_id"],
                    user_email,
                    vehicle_details,
                    personal_info,
                    policy_details,
                    app["status"]
                ))
            return applications