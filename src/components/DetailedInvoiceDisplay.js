import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { Avatar } from "@mui/material";

import ExpenseCard from "./ExpenseCard";
import ExpenseForm from "./ExpenseForm";
import ReceiptDisplay from "./ReceiptDisplay";
import { useParams } from "react-router-dom";
import axios from "axios";

/****************************************************************/
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
/****************************************************************/

export default function DetailedInvoiceDisplay(props) {
  let { groupId, invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState("");
  const [groupMembersData, setGroupMembersData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  // axios get invoice name, author, date, groupname details from backend
  const getInvoiceData = async () => {
    let invoicedata = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/invoices/invoice/${invoiceId}`
    );
    console.log("invoice details: ", invoicedata.data);
    setInvoiceData(invoicedata.data);
  };

  // axios get group members data from backend
  const getMembers = async () => {
    let groupmembers = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/users/${groupId}`
    );
    console.log("group members details: ", groupmembers.data.users);
    setGroupMembersData(groupmembers.data.users);
  };

  // axios get expenses for specific invoice from backend
  const getExpenses = async () => {
    let expenseList = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/expenses/invoice/${invoiceId}`
    );
    console.log("expenses list: ", expenseList.data);
    setExpensesData(expenseList.data);
  };

  useEffect(() => {
    getExpenses();
    getInvoiceData();
  }, [invoiceId]);

  useEffect(() => {
    getMembers();
  }, [groupId]);

  const [open, setOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearRecords = () => {
    console.log("add in router for clear records ");
  };

  const addButton = (
    <center>
      <span>
        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Expense
        </Button>
        <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
          <DialogContent>
            <ExpenseForm
              groupId={groupId}
              invoiceId={invoiceId}
              reloadAllExpenses={getExpenses}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </span>
    </center>
  );

  const clearAllButton = (
    <center>
      <span>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteForeverIcon />}
          onClick={() => {
            setClearOpen(true);
          }}
        >
          Clear All
        </Button>
        <Dialog
          open={clearOpen}
          onClose={() => {
            setClearOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm delete?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be undone. Deleted records cannot be recovered.
              Are you sure you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setClearOpen(false);
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                setClearOpen(false);
                clearRecords();
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    </center>
  );

  const displayAllExpenses = (
    <Box>
      <List>
        {expensesData.map((expense) => (
          <ExpenseCard
            expenseid={expense.id}
            itemName={expense.name}
            itemPrice={expense.amount}
            paidby={expense.payer.name}
          />
        ))}
      </List>
    </Box>
  );

  const displaySplitBill = (
    <div>
      {expensesData ? (
        <div>
          {groupMembersData && (
            <Box>
              <List>
                {groupMembersData.map((contact) => (
                  <ReceiptDisplay
                    invoiceid={invoiceId}
                    spenderid={contact.id}
                  />
                ))}
              </List>
            </Box>
          )}
        </div>
      ) : (
        <center>
          <h4>Nothing to split. Add a new expense to begin.</h4>
        </center>
      )}
    </div>
  );

  return (
    <div>
      <Container sx={{ maxWidth: { xl: 980 } }}>
        <Box mt={2}>
          <Card>
            <CardContent>
              {invoiceData && (
                <Box display="flex" mb={1}>
                  <Box ml={2} flex="1">
                    <Typography variant="h5">{invoiceData.name}</Typography>
                    <Typography variant="body2">
                      {invoiceData.date.slice(0, 10)}, by{"  "}
                      {invoiceData.author.name}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Expenses" {...a11yProps(0)} />
                    <Tab
                      label={
                        groupMembersData.length === 1
                          ? "1 Member"
                          : `${groupMembersData.length} Members`
                      }
                      {...a11yProps(1)}
                    />
                    <Tab label="Split Bill" {...a11yProps(2)} />
                  </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                  {addButton}
                  <br />
                  {displayAllExpenses}
                  <br />
                  {clearAllButton}
                </TabPanel>

                <TabPanel value={value} index={1}>
                  <ContactsIterator members={groupMembersData} />
                </TabPanel>

                <TabPanel value={value} index={2}>
                  {displaySplitBill}
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
}

const ContactsIterator = (props) => {
  let currentgroup = [...props.members];

  return (
    <Box>
      <List>
        {currentgroup &&
          currentgroup.map((contact) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar src={""}>{contact.name.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${contact.name}`}
                secondary={<>{contact.email}</>}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
