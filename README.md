# Trove-Developer-Challenge
An app for users to make valuable investments in stocks and shares.
It also gives users opportunity to take loans and payback installmentally over a given period

   
The API is dpeloyed at https://trove-test-app.herokuapp.com

To use the api look through the <a href="https://documenter.getpostman.com/view/15666544/UVBzmpG7">documentation</a>

## Getting started
### Prerequisites
- Node v14.x
- npm >= 6.14
- Git installed

### Running Locally
- Clone the repository. Run the following  in your terminal
```bash
$ git clone https://github.com/Ose-4g/Trove-Developer-Challenge.git
$ cd Trove-Developer-Challenge
$ npm install
```
- In the root directory of the project create a **.env** file and copy the values from **.env.sample** and set the values of the veriables correctly.
- To run locally you'll need 
  - URI to a mongoDB server running locally or in the cloud
  - URI to another mongoDB database for testing.
  - Client keys and secret for nodemailer with gmail
- To run locally after setting the environment variables correctly.
  - To run in development mode
  ```bash
  $ npm run dev
  ```
  - To run in production mode 
   - set NODE_ENV in your **.env** to ```production```
   - Run in your terminal
   ```bash
  $ npm run build
  $ npm start
  ```
