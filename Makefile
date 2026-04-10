.PHONY: fe be dev

# Start frontend
fe:
	cd frontend && npm run dev -- -p 3001

# Start backend
be:
	cd backend && chmod +x mvnw && ./mvnw spring-boot:run

# Start both simultaneously
dev:
	concurrently \
		--names "FE,BE" \
		--prefix-colors "blue,green" \
		"make fe" \
		"make be"