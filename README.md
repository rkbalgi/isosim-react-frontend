# isosim-react-frontend
A react based front end for [isosim](https://github.com/rkbalgi/isosim)

# Testing Locally
- Run [isosim](https://github.com/rkbalgi/isosim) locally at port 8080
- Edit [src/components/Utils/Properties.js](https://github.com/rkbalgi/isosim-react-frontend/blob/release/2020.04/src/components/Utils/Properties.js) and change this.baseUrl to `this.baseUrl = 'http://localhost:8080'`
- Start the application by running - `npm start`

# Building
- Change the baseUrl in [src/components/Utils/Properties.js](https://github.com/rkbalgi/isosim-react-frontend/blob/release/2020.04/src/components/Utils/Properties.js) to `this.baseUrl=''`
- Run `npm run-script build`

# Deploying with Isosim
Once built, 
- Delete the existing __build__ directory from [isosim/web/react-fe](https://github.com/rkbalgi/isosim/tree/master/web/react-fe)
- Copy the build folder to isosim/web/react-fe/
- Restart Isosim
