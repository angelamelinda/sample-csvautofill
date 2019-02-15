import React, { Component } from "react";
import Profile from "./Profile";
import { TabPane, Grid, Button, Input } from "semantic-ui-react";
import { CsvAutoFill } from "csvautofilljs";
import { toast } from "react-toastify";
import moment from "moment";

class Application extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      idNumber: "",
      fullName: "",
      gender: "",
      dateOfBirth: undefined,
      file: null,
      fileName: "",
      error: ""
    };
  }

  handleChangeFile = (e: any) => {
    const file = e.target.files[0];
    let state = file
      ? {
          fileName: file.name,
          file
        }
      : {
          fileName: null,
          file: null
        };

    this.setState(state);
    e.target.value = null;
  };

  removeState = () => {
    return {
      idNumber: "",
      fullName: "",
      gender: "",
      dateOfBirth: undefined,
      fileName: "",
      file: null
    };
  };

  handleUpload = e => {
    e.preventDefault();

    CsvAutoFill.uploadFile({ file: this.state.file }).then(result => {
      if (result.statusCode === 1 && Array.isArray(result.data)) {
        let state = {};
        let x = result.data.forEach(val => {
          let key = val.key;
          let value;
          let el = document.getElementsByName("csv-" + key) as any;
          let type = el[0].getAttribute("type");
          let disabled = el[0].disabled;
          if (type === "checkbox" || type === "radio") {
            if (val.value.toString().toLowerCase() === "yes") {
              value = true;
            } else {
              value = false;
            }
          } else if (type === "number") {
            if (
              Number(val.value) !== NaN &&
              !val.value.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/)
            ) {
              value = Number(val.value);
            } else {
              value = "";
            }
          } else if (type === "date") {
            value = moment(val.value);
          } else {
            value = val.value;
          }

          if (disabled === false) {
            state = { ...state, [key]: value };
          }
        });

        this.setState({ ...state, error: "", fileName: "", file: null });
        toast.success("CSV Uploaded!");
      } else if (result.statusCode === 0 && !Array.isArray(result.data)) {
        this.setState({
          error: result.data.message,
          ...this.removeState
        });
        toast.error("Failed to Upload!");
      }
    });
  };

  updateInputValue = (e: any, field: string) => {
    let state = {};
    if (field === "idNumber") {
      state = {
        idNumber: e.target.value
      };
    } else if (field === "fullName") {
      state = {
        fullName: e.target.value
      };
    } else if (field === "gender") {
      state = {
        gender: e.target.value
      };
    } else if (field === "dateOfBirth") {
      state = {
        dateOfBirth: e.target.value
      };
    }

    this.setState(state);
  };

  dateOnChange = value => {
    console.log(value);
    this.setState({
      dateOfBirth: moment(value)
    });
  };

  render() {
    let profile = {
      idNumber: this.state.idNumber,
      fullName: this.state.fullName,
      gender: this.state.gender,
      dateOfBirth: this.state.dateOfBirth,
      updateInputValue: this.updateInputValue,
      dateOnChange: this.dateOnChange
    };
    return (
      <TabPane>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label>Generate Template</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button
                      onClick={() => {
                        CsvAutoFill.generateFile();
                        toast.success("CSV Downloaded!");
                      }}
                    >
                      Download
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label>Upload CSV</label>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div className="choose-file-wrapper">
                      <label className="choose-file">
                        <Input
                          className="input-file"
                          type="file"
                          onChange={this.handleChangeFile}
                        />
                        <Input
                          className={
                            this.state.error !== ""
                              ? "error no-event"
                              : "no-event"
                          }
                          value={this.state.fileName ? this.state.fileName : ""}
                        />
                        <Button
                          className="no-event"
                          onClick={this.handleUpload}
                        >
                          Choose File
                        </Button>
                      </label>
                      <Button onClick={this.handleUpload}>Upload</Button>
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pt-0 pb-0">
                  <Grid.Column width={4} />
                  <Grid.Column width={4} className="color-danger">
                    {this.state.error}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Profile {...profile} />
        </Grid>
      </TabPane>
    );
  }
}

export default Application;
