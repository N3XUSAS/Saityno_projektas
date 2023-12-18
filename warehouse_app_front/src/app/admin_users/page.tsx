"use client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import { jwtDecode } from "jwt-decode";
import { Open_Sans } from "next/font/google";
import { truncate } from "fs";

const openSans = Open_Sans({
  weight: "800",
  subsets: ["latin"],
  display: "swap",
});

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#427d9d",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};
const barStyle = {
  bgcolor: "#427d9d",
  extAlign: "center",
};

interface Props {
  window?: () => Window;
}

export default function Home(props: Props) {
  const router = useRouter();
  const [logged, setLogged] = React.useState("");

  let jwt = "";
  try {
    jwt = localStorage.getItem("token") || "";
  } catch (error) {}

  function checkToken() {
    if (jwt != "") {
      const decoded = jwtDecode(jwt);
      const exp = decoded.exp as number;
      setLogged(decoded.sub as string);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      console.log(exp + " " + currentTime);
      if (exp < currentTime) {
        localStorage.setItem("token", "");
        router.push("/login");
      }
      console.log(decoded);
    } else {
      router.push("/login");
    }
  }

  function ToDashboard() {
    checkToken();
    router.push("/admin_data");
  }

  function LogOut() {
    router.push("/login");
  }

  const [openUserAdd, setOpenUserAdd] = React.useState(false);
  const handleOpenUserAdd = () => setOpenUserAdd(true);
  const handleCloseUserAdd = () => {
    setOpenUserAdd(false);
    setNewUserErrors({
      name: "",
      surname: "",
      email: "",
      password: "",
      companyName: "",
      companyId: "",
    });
  };

  const [openUserDelete, setOpenUserDelete] = React.useState(false);
  function handleOpenUserDelete(id: string) {
    setDelUser(id);
    setOpenUserDelete(true);
  }
  const handleCloseUserDelete = () => {
    setOpenUserDelete(false);
  };
  const [delUser, setDelUser] = React.useState("");

  const [userData, setUserData] = React.useState([
    {
      companyId: -1,
      id: "",
      username: "",
      email: "",
      name: "",
      surname: "",
      companyName: "",
    },
  ]);

  const [companyNames, setCompanyNames] = React.useState([""]);

  const [companyData, setCompanyData] = React.useState([
    {
      id: -1,
      name: "",
      city: "",
      address: "",
      owner: "",
      email: "",
      created: "",
    },
  ]);

  const [newUser, setNewUser] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    companyName: "",
    companyId: -1,
  });

  const [newUserErrors, setNewUserErrors] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    companyName: "",
    companyId: "",
  });

  function ErrorHandling() {
    if (
      newUserErrors.name != "" ||
      newUserErrors.password != "" ||
      newUserErrors.surname != "" ||
      newUserErrors.companyId != "" ||
      newUserErrors.companyName != "" ||
      newUserErrors.email != ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  let isSet = false;

  const handleUAChange = (e: { target: { name: any; value: any } }) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
    console.log(newUser);
  };

  const setNewCompanyName = (e: { target: { value: any } }) => {
    console.log(e.target.value);
    setNewUser({
      ...newUser,
      companyName: companyData[e.target.value].name,
      companyId: companyData[e.target.value].id,
    });
  };

  async function fetchUsers() {
    checkToken();
    try {
      axios
        .get("https://localhost:7296/api/auth/getall", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchcompanies() {
    checkToken();
    try {
      axios
        .get("https://localhost:7296/api/companies", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setCompanyData(response.data);
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function postUser() {
    let flag: boolean = false;
    checkToken();
    try {
      axios
        .post("https://localhost:7296/api/auth/register", newUser, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          fetchUsers();
          fetchUsers();
          setNewUser({
            name: "",
            surname: "",
            email: "",
            password: "",
            companyName: "",
            companyId: -1,
          });
          setOpenUserAdd(false);
        })
        .catch((error) => {
          setNewUserErrors(error.response.data.errors);
          console.log(error.response.data, "error.response.data");
        });
    } catch (error) {}
  }

  async function DeleteUser(userId: string) {
    checkToken();
    try {
      const res = await axios
        .delete("https://localhost:7296/api/auth/" + userId, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    fetchUsers();
    setOpenUserDelete(false);
  }

  React.useEffect(() => {
    checkToken();
    fetchcompanies();
    fetchUsers();
    fetchcompanies();
  }, []);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={barStyle}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          color: "#d3d3d3",
          textAlign: "center",
          fontFamily: openSans.style.fontFamily,
        }}
      >
        Warehouse Administration System
      </Typography>
      <Divider />
      <List sx={{ display: "flex", flexDirection: "column" }}>
        <Button
          sx={{ color: "#d3d3d3", fontFamily: openSans.style.fontFamily }}
          onClick={ToDashboard}
        >
          Dashboard
        </Button>
        <Button
          sx={{ color: "#d3d3d3", fontFamily: openSans.style.fontFamily }}
          onClick={LogOut}
        >
          Log Out
        </Button>
      </List>
    </Box>
  );

  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-1/12">
        <Box>
          <AppBar component="nav" sx={barStyle}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block" },
                  color: "#d3d3d3",
                  fontFamily: openSans.style.fontFamily,
                }}
              >
                Warehouse Administration System
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  sx={{
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  }}
                  onClick={ToDashboard}
                >
                  Dashboard
                </Button>
                <Button
                  sx={{
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  }}
                  onClick={LogOut}
                >
                  Log Out
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <nav>
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 170,
                  bgcolor: "#427d9d",
                },
              }}
            >
              {drawer}
            </Drawer>
          </nav>
        </Box>
      </div>
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-11/12 bg2">
        <div className="bg1 rounded-2xl h-full mx-4 flex flex-col items-center">
          <TableContainer sx={{ maxHeight: 500, maxWidth: 1200 }}>
            <Table
              className="bg1"
              stickyHeader
              size="small"
              aria-label="simple table"
            >
              <TableHead
                sx={{
                  "& th": {
                    backgroundColor: "#356985",
                    border: "0px",
                  },
                  "& th:first-child": {
                    borderRadius: "5px 0 0 5px",
                  },
                  "& th:last-child": {
                    borderRadius: "0 5px 5px 0",
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    User ID
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    Surname
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    Username
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    Company name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#d3d3d3",
                      fontFamily: openSans.style.fontFamily,
                    }}
                  >
                    {" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell
                      sx={{
                        color: "#d3d3d3",
                        fontFamily: openSans.style.fontFamily,
                      }}
                      component="th"
                      scope="row"
                      align="center"
                      height="50"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#d3d3d3",
                        fontFamily: openSans.style.fontFamily,
                      }}
                      align="center"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#d3d3d3",
                        fontFamily: openSans.style.fontFamily,
                      }}
                      align="center"
                    >
                      {row.surname}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#d3d3d3",
                        fontFamily: openSans.style.fontFamily,
                      }}
                      align="center"
                    >
                      {row.username}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#d3d3d3",
                        fontFamily: openSans.style.fontFamily,
                      }}
                      align="center"
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#d3d3d3",
                        fontFamily: openSans.style.fontFamily,
                      }}
                      align="center"
                    >
                      {row.companyName}
                    </TableCell>
                    <TableCell align="center">
                      {logged != row.id && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenUserDelete(row.id)}
                          style={{
                            backgroundColor: "#c10000",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      )}
                      <Modal
                        open={openUserDelete}
                        onClose={handleCloseUserDelete}
                      >
                        <Box sx={modalStyle}>
                          <div className="flex flex-row-reverse">
                            <IconButton
                              onClick={handleCloseUserDelete}
                              sx={{ width: 40 }}
                            >
                              <CloseIcon />
                            </IconButton>
                            <h3 className="text-xl text-[#d3d3d3] m-1 basis-11/12">
                              Delete user {delUser}?
                            </h3>
                          </div>

                          <p className="text-m text-[#d3d3d3] m-1">
                            This user will be deleted permanently!
                          </p>
                          <Button
                            onClick={() => DeleteUser(delUser)}
                            variant="contained"
                            color="error"
                            style={{ backgroundColor: "#c10000" }}
                            startIcon={<DeleteIcon />}
                            sx={{
                              marginTop: 3,
                              fontFamily: openSans.style.fontFamily,
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Modal>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
          <Button
            onClick={handleOpenUserAdd}
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            style={{
              color: "#d3d3d3",
              background: "#356985",
              width: 1200,
              fontFamily: openSans.style.fontFamily,
            }}
          >
            Add new user
          </Button>
          <Modal open={openUserAdd} onClose={handleCloseUserAdd}>
            <Box sx={modalStyle}>
              <div className="flex flex-row-reverse">
                <IconButton
                  onClick={handleCloseUserAdd}
                  sx={{ width: 40 }}
                  style={{ color: "#d3d3d3", background: "#356985" }}
                >
                  <CloseIcon />
                </IconButton>
                <h3 className="text-xl text-[#d3d3d3] m-1 basis-11/12">
                  Add User
                </h3>
              </div>
              <p className="text-m text-[#c10000] m-1">{newUserErrors.name}</p>
              <TextField
                name="name"
                onChange={handleUAChange}
                label="Name"
                variant="standard"
                inputProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black",
                  },
                }}
              />
              <p className="text-m text-[#c10000] m-1">
                {newUserErrors.surname}
              </p>
              <TextField
                name="surname"
                onChange={handleUAChange}
                label="Surname"
                variant="standard"
                inputProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black",
                  },
                  marginTop: 3,
                }}
              />
              <p className="text-m text-[#c10000] m-1">{newUserErrors.email}</p>
              <TextField
                name="email"
                onChange={handleUAChange}
                label="Email"
                variant="standard"
                inputProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black",
                  },
                  marginTop: 3,
                }}
              />
              <p className="text-m text-[#c10000] m-1">
                {newUserErrors.password}
              </p>
              <TextField
                name="password"
                onChange={handleUAChange}
                label="Password"
                variant="standard"
                inputProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black",
                  },
                  marginTop: 3,
                }}
              />
              <p className="text-m text-[#c10000] m-1">
                {newUserErrors.companyName}
              </p>
              <TextField
                name="companyName"
                onChange={setNewCompanyName}
                label="Company"
                select
                inputProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#d3d3d3",
                    fontFamily: openSans.style.fontFamily,
                  },
                }}
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "black",
                    },
                  marginTop: 3,
                }}
              >
                {companyData.map((company, index) => (
                  <MenuItem
                    key={company.id}
                    value={index}
                    sx={{ fontFamily: openSans.style.fontFamily }}
                  >
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={() => postUser()}
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ marginTop: 3 }}
                style={{
                  color: "#d3d3d3",
                  background: "#356985",
                  fontFamily: openSans.style.fontFamily,
                }}
              >
                Save
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-1/12 bg1 flex flex-col items-center">
        <h3 className="text-xl text-[#d3d3d3] m-1">
          Warehouse Administration System
        </h3>
        <p className="text-m text-[#d3d3d3] m-1">Simonas Nalivaika</p>
      </div>
    </div>
  );
}
