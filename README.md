# Overview

# Step By Step Installations
npm init -y : 
creates a Package json
npm install -D typescript
npm install -D ts-node
npm install -D nodemon : To run the Project , and keep the project run across all changes
/*Like wise all the npm installations for packages used in this Project*/

npm i express body-parser cookie-parser compression cors
npm i -D types/body-parser @types/cookie-parser @types/compression @types/cors

# Step By Step Project Structure Setup
Create a src folder and 
 add index.js file as main file to initialize server & DB connections
 Add Routes : API to Use
 Add Models : Schema to define DB 

# Create Tests Folder
Add test.js file : Includes basic test cases
jest.config.js file: Configuration related to test case env

# Local Set Up
Install Node JS : Download the Code from GITHUB and place in some local dir
Install Mongo DB : From Index.js file take the MONGO_URL and replace with your local DB URL
Install Postman: FROM ROUTES , test all the APIS 
