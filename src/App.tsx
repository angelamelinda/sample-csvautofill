import React, { Component } from "react";
import "./App.css";
import FormSample from "./Container/FormSample";
import Application from "./Container/Application";
import { ToastContainer, toast } from "react-toastify";
import { Tab } from "semantic-ui-react";

const panes = [
  { menuItem: "Sample Form", render: () => <FormSample /> },
  { menuItem: "Nested Component Form ", render: () => <Application /> }
];

class App extends Component {
  render() {
    return (
      <>
        <div className="App">
          <Tab panes={panes} />
        </div>
        <ToastContainer
          position={toast.POSITION.BOTTOM_CENTER}
          autoClose={3000}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </>
    );
  }
}

export default App;
