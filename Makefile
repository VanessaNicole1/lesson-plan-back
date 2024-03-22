crear_roles:
	curl -X POST -H "Content-Type: application/json" -d "$(body)" http://localhost:4000/roles

get_roles:
	curl -X GET  http://localhost:4000/roles


crear_manager:
	@$(MAKE) crear_roles body='{"name": "MANAGER"}'

crear_student:
	@$(MAKE) crear_roles body='{"name": "STUDENT"}'

crear_teacher:
	@$(MAKE) crear_roles body='{"name": "TEACHER"}'

crear_todos:
	@$(MAKE) crear_manager
	@$(MAKE) crear_student
	@$(MAKE) crear_teacher

create_email_config:
	curl -X POST -H "Content-Type: application.json" -d "$(body)" http://localhost:4000/email

create_config:
	@$(MAKE) create_email_config body='{"host": "smtp.gmail.com", "port": "465", "user": "vanessa.iniguez@unl.edu.ec", "sender": "vanessa.iniguez@unl.edu.ec", "password": "aipt swen rvpr pzfw"}'

create_email:
	@$(MAKE) create_config
