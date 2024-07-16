# Slot Game

This README file provides instructions for cloning and running the **Slot Game** project locally.

## Getting Started

Follow these steps to clone the project to your local environment.

### Prerequisites

- Node.js (version 14 or above)
- Docker

### Installation

1. **Clone the Project**

   ```bash
   git clone https://github.com/naxxttech/slot.git
   
2. **Navigate to the Project Directory**
   <p>Go to root directory of project</p>
   <p>Open terminal and type <b>npm install</b> </p>
   <p>After installation is done create .env file and paste those keys:</p>
   
   ```bash
    NODE_ENV=development
    PORT=3000

3. **Run with Docker**
   <p>Open terminal and type</p>
   
   ```bash
   docker-compose up --build

  <p>This command will start the project within Docker containers.</p>
   
4. **Access the Application**
    <p>
        The application will run by default at http://localhost:4000. You can access it via your web browser or an HTTP client (e.g. Postman).
    </p>
