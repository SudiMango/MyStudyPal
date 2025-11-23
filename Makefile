.PHONY: fe be

# Start frontend
fe:
	cd frontend && npm run dev

# Start backend
be:
	cd backend && mvnw.cmd spring-boot:run