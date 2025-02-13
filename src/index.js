import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



// do one thing, instead of opening the saved changes table in a window, open it same window, and add a back button to go back to the previous one. in the setup fee plan, make the texts center aligned and for the textfield in fees heads write a placeholder text "Enter Fee Head" and for amount "Enter Amount". in the page when we click on save, add a button for editing and deleting. on editing you can enable the fields to be edited. and on deleting you can delete an entry. make sure the functionalities u use here and user friendly and look professional and pretty. 

// then i want you to make another page and give a button on the setup fees plan page somehwere below as "Manual Fees Setup". i have attached an image. make it exactly like that. use the styling from my code for that. in this page user can manually enter in the fields and make sure it is dynamic. on entering the amounts, the total amount should be updated as shown in image. 