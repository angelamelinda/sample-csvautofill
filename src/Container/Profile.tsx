import React from "react";
import {
  Grid,
  Checkbox,
  Input,
  Radio,
  Form,
  TextArea,
  Button,
  TabPane,
  Label
} from "semantic-ui-react";
import Calendar from "rc-calendar";
import DatePicker from "rc-calendar/lib/Picker";

export const Profile = (props: any) => {
  let calendar = <Calendar />;
  return (
    <>
      <Grid.Row>
        <Grid.Column>
          <Grid>
            <Grid.Row verticalAlign={"middle"}>
              <Grid.Column width={4}>
                <label htmlFor='csv-idNumber'>Identity Number</label>
              </Grid.Column>
              <Grid.Column width={4}>
                <Input
                  fluid
                  name='csv-idNumber'
                  value={props.idNumber}
                  onChange={e => props.updateInputValue(e, "idNumber")}
                />
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
                <label htmlFor='csv-fullName'>Full Name</label>
              </Grid.Column>
              <Grid.Column width={4}>
                <Input
                  fluid
                  name='csv-fullName'
                  value={props.fullName}
                  onChange={e => props.updateInputValue(e, "fullName")}
                />
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
                <label>Gender</label>
              </Grid.Column>
              <Grid.Column width={4}>
                <select
                  value={props.gender}
                  onChange={e => props.updateInputValue(e, "gender")}
                >
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
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
                <label htmlFor='csv-dateOfBirth'>Date of Birth</label>
              </Grid.Column>
              <Grid.Column width={4}>
                <DatePicker
                  animation='slide-up'
                  calendar={calendar}
                  value={props.dateOfBirth}
                  onChange={props.dateOnChange}
                >
                  {({ value }) => {
                    return (
                      <span>
                        <Input
                          type='date'
                          fluid
                          name='csv-dateOfBirth'
                          readOnly
                          className='ant-calendar-picker-input ant-input'
                          value={(value && value.format("YYYY-MM-DD")) || ""}
                        />
                      </span>
                    );
                  }}
                </DatePicker>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    </>
  );
};

export default Profile;
