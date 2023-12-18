"use client";
//import "../app/globals.css";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
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
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { Open_Sans } from "next/font/google";

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

  const [openCompanyEdit, setOpenCompanyEdit] = React.useState(false);
  const handleOpenCompanyEdit = () => setOpenCompanyEdit(true);
  const handleCloseCompanyEdit = () => {
    setOpenCompanyEdit(false);
    setCompanyError({ name: "", city: "", address: "", owner: "", email: "" });
    setEditCompany(singleCompany);
  };

  const [openCompanyDelete, setOpenCompanyDelete] = React.useState(false);
  const handleOpenCompanyDelete = () => setOpenCompanyDelete(true);
  const handleCloseCompanyDelete = () => setOpenCompanyDelete(false);

  const [openCompanyAdd, setOpenCompanyAdd] = React.useState(false);
  const handleOpenCompanyAdd = () => setOpenCompanyAdd(true);
  const handleCloseCompanyAdd = () => {
    setOpenCompanyAdd(false);
    setCompanyError({ name: "", city: "", address: "", owner: "", email: "" });
  };

  const [warehouseData, setWarehouseData] = React.useState([
    {
      id: 0,
      city: "",
      address: "",
      maneger: "",
    },
  ]);

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

  const [singleCompany, setSingleCompany] = React.useState({
    id: -1,
    name: "",
    city: "",
    address: "",
    owner: "",
    email: "",
    created: "",
  });

  const [addCompany, setAddCompany] = React.useState({
    name: "temp",
    city: "",
    address: "",
    owner: "",
    email: "",
  });

  const [currentCompany, setCurrentCompany] = React.useState({
    id: -1,
    index: -1,
  });

  const [editCompany, setEditCompany] = React.useState({
    name: "temp",
    city: "",
    address: "",
    owner: "",
    email: "",
  });

  const [CompanyError, setCompanyError] = React.useState({
    name: "",
    city: "",
    address: "",
    owner: "",
    email: "",
  });

  const [companyEditActive, setCompanyEditActive] = React.useState(true);
  const [companyDeleteActive, setCompanyDeleteActive] = React.useState(true);

  let jwt = "";
  try {
    jwt = localStorage.getItem("token") || "";
  } catch (error) {}

  function checkToken() {
    if (jwt != "") {
      const decoded = jwtDecode(jwt);
      const exp = decoded.exp as number;
      const currentTime = Math.floor(new Date().getTime() / 1000);
      console.log(exp + " " + currentTime);
      if (exp < currentTime) {
        localStorage.setItem("token", "");
        router.push("/login");
      }
    } else {
      router.push("/login");
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

  async function fetchWarehouses(id: number) {
    checkToken();
    setCompanyEditActive(false);
    setCompanyDeleteActive(false);
    try {
      axios
        .get("https://localhost:7296/api/companies/" + id + "/warehouses", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setWarehouseData(response.data);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function setCompany(index: number) {
    setSingleCompany({
      id: companyData[index].id,
      name: companyData[index].name,
      city: companyData[index].city,
      address: companyData[index].address,
      owner: companyData[index].owner,
      email: companyData[index].email,
      created: companyData[index].created,
    });
    setEditCompany({
      name: companyData[index].name,
      city: companyData[index].city,
      address: companyData[index].address,
      owner: companyData[index].owner,
      email: companyData[index].email,
    });
    setCurrentCompany({ id: companyData[index].id, index: index });
    fetchWarehouses(companyData[index].id);
  }

  const handleCAChange = (e: { target: { name: any; value: any } }) => {
    setAddCompany({
      ...addCompany,
      [e.target.name]: e.target.value,
    });
  };

  const handleCEChange = (e: { target: { name: any; value: any } }) => {
    setEditCompany({
      ...editCompany,
      [e.target.name]: e.target.value,
    });
  };

  async function postNewCompany() {
    checkToken();
    try {
      const res = await axios
        .post("https://localhost:7296/api/companies", addCompany, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setCompanyEditActive(true);
          setCompanyDeleteActive(true);
          setAddCompany({
            city: "",
            address: "",
            owner: "",
            name: "temp",
            email: "",
          });
          fetchcompanies();
          setSingleCompany({
            city: "",
            address: "",
            owner: "",
            name: "",
            email: "",
            id: -1,
            created: "",
          });
          setWarehouseData([{ id: -1, city: "", address: "", maneger: "" }]);
          setCurrentCompany({ id: -1, index: -1 });
          setOpenCompanyAdd(false);
        })
        .catch((error) => {
          setCompanyError(error.response.data.errors);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function DeleteCompany() {
    checkToken();
    try {
      // Replace 'your-api-endpoint' with your actual API endpoint
      const res = await axios
        .delete("https://localhost:7296/api/companies/" + currentCompany.id, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setCompanyEditActive(true);
    setCompanyDeleteActive(true);
    setSingleCompany({
      id: -1,
      name: "",
      owner: "",
      email: "",
      city: "",
      address: "",
      created: "",
    });
    setCurrentCompany({ id: -1, index: -1 });
    fetchcompanies();
    setWarehouseData([{ id: -1, city: "", address: "", maneger: "" }]);
    setOpenCompanyDelete(false);
  }

  async function EditCompany() {
    checkToken();
    try {
      const res = await axios
        .put(
          "https://localhost:7296/api/companies/" + currentCompany.id,
          editCompany,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setCompanyEditActive(true);
          setCompanyDeleteActive(true);
          setSingleCompany({
            id: -1,
            name: "",
            owner: "",
            email: "",
            city: "",
            address: "",
            created: "",
          });
          setCurrentCompany({ id: -1, index: -1 });
          fetchcompanies();
          setWarehouseData([{ id: -1, city: "", address: "", maneger: "" }]);
          setOpenCompanyEdit(false);
        })
        .catch((error) => {
          setCompanyError(error.response.data.errors);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  React.useEffect(() => {
    checkToken();
    fetchcompanies();
  }, []);

  function ToAdmin() {
    checkToken();
    router.push("/admin_users");
  }

  function LogOut() {
    router.push("/login");
  }

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
          onClick={ToAdmin}
        >
          Users
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
    <main>
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
                    onClick={ToAdmin}
                  >
                    Users
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
          <div className="p-3 flex flex-row items-center space-x-2 h-full">
            <div className="bg1 rounded-2xl flex flex-col space-y-2 w-3/6 h-full p-6">
              <div className="flex flex-row-reverse">
                <Button
                  onClick={handleOpenCompanyAdd}
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={{
                    color: "#d3d3d3",
                    background: "#356985",
                    fontFamily: openSans.style.fontFamily,
                  }}
                >
                  Add
                </Button>
                <Modal open={openCompanyAdd} onClose={handleCloseCompanyAdd}>
                  <Box sx={modalStyle}>
                    <div className="flex flex-row-reverse">
                      <IconButton
                        onClick={handleCloseCompanyAdd}
                        sx={{ width: 40 }}
                        style={{ color: "#d3d3d3", background: "#356985" }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <h3 className="text-xl text-[#d3d3d3] m-1 basis-11/12">
                        Add Company
                      </h3>
                    </div>
                    <p className="text-m text-[#c10000] m-1">
                      {CompanyError.name}
                    </p>
                    <TextField
                      name="name"
                      onChange={handleCAChange}
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
                      {CompanyError.owner}
                    </p>
                    <TextField
                      name="owner"
                      onChange={handleCAChange}
                      label="Owner"
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
                      {CompanyError.city}
                    </p>
                    <TextField
                      name="city"
                      onChange={handleCAChange}
                      label="City"
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
                      {CompanyError.address}
                    </p>
                    <TextField
                      name="address"
                      onChange={handleCAChange}
                      label="Address"
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
                      {CompanyError.email}
                    </p>
                    <TextField
                      name="email"
                      onChange={handleCAChange}
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
                    <Button
                      onClick={postNewCompany}
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{
                        marginTop: 3,
                        fontFamily: openSans.style.fontFamily,
                      }}
                      style={{ color: "#d3d3d3", background: "#356985" }}
                    >
                      Save
                    </Button>
                  </Box>
                </Modal>
                <h3 className="text-xl text-[#d3d3d3] m-1 basis-11/12">
                  Companies
                </h3>
              </div>
              <br></br>
              <TableContainer sx={{ maxHeight: 800 }}>
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
                        sx={{
                          color: "#d3d3d3",
                          fontFamily: openSans.style.fontFamily,
                        }}
                        align="left"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#d3d3d3",
                          fontFamily: openSans.style.fontFamily,
                        }}
                        align="center"
                      >
                        Owner
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyData.map((row, index) => (
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
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
                          {row.owner}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            onClick={() => setCompany(index)}
                            startIcon={<InfoIcon />}
                            style={{
                              color: "#d3d3d3",
                              background: "#356985",
                              fontFamily: openSans.style.fontFamily,
                            }}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="p-6 bg1 rounded-2xl w-3/6 h-full flex flex-col">
              <div className="basis-3/12">
                <h3 className="text-xl text-[#d3d3d3]">Company Details</h3>
                <TableContainer>
                  <Table className="bg1" size="small" aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          {singleCompany.name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          Owner
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          {singleCompany.owner}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          City
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          {singleCompany.city}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          Address
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          {singleCompany.address}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          {singleCompany.email}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          Created
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          component="th"
                          scope="row"
                        >
                          {singleCompany.created}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="basis-9/12">
                <h3 className="text-xl text-[#d3d3d3]">
                  Warehouses in Company
                </h3>
                <br></br>
                <TableContainer sx={{ maxHeight: 200 }}>
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
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          align="center"
                        >
                          City
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          align="center"
                        >
                          Address
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#d3d3d3",
                            fontFamily: openSans.style.fontFamily,
                          }}
                          align="center"
                        >
                          Maneger
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {warehouseData.map((row, index) => (
                        <TableRow>
                          <TableCell
                            sx={{
                              color: "#d3d3d3",
                              fontFamily: openSans.style.fontFamily,
                            }}
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {row.city}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#d3d3d3",
                              fontFamily: openSans.style.fontFamily,
                            }}
                            align="center"
                          >
                            {row.address}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#d3d3d3",
                              fontFamily: openSans.style.fontFamily,
                            }}
                            align="center"
                          >
                            {row.maneger}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br></br>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={companyEditActive}
                  startIcon={<EditIcon />}
                  sx={{ marginRight: 3, fontFamily: openSans.style.fontFamily }}
                  onClick={handleOpenCompanyEdit}
                  style={{ color: "#d3d3d3", background: "#356985" }}
                >
                  Edit Company
                </Button>
                <Modal open={openCompanyEdit} onClose={handleCloseCompanyEdit}>
                  <Box sx={modalStyle}>
                    <div className="flex flex-row-reverse">
                      <IconButton
                        onClick={handleCloseCompanyEdit}
                        sx={{ width: 40 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <h3 className="text-xl text-[#d3d3d3] m-1 basis-11/12">
                        Edit Company
                      </h3>
                    </div>
                    <p className="text-m text-[#c10000] m-1">
                      {CompanyError.owner}
                    </p>
                    <TextField
                      name="owner"
                      onChange={handleCEChange}
                      value={editCompany.owner}
                      label="Owner"
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
                      {CompanyError.city}
                    </p>
                    <TextField
                      name="city"
                      onChange={handleCEChange}
                      value={editCompany.city}
                      label="City"
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
                      {CompanyError.address}
                    </p>
                    <TextField
                      name="address"
                      onChange={handleCEChange}
                      value={editCompany.address}
                      label="Address"
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
                      {CompanyError.email}
                    </p>
                    <TextField
                      name="email"
                      onChange={handleCEChange}
                      value={editCompany.email}
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
                    <Button
                      onClick={() => EditCompany()}
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{
                        marginTop: 3,
                        fontFamily: openSans.style.fontFamily,
                      }}
                      style={{ color: "#d3d3d3", background: "#356985" }}
                    >
                      Save
                    </Button>
                  </Box>
                </Modal>
                <Button
                  variant="contained"
                  color="error"
                  disabled={companyDeleteActive}
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenCompanyDelete}
                  style={{
                    color: "#d3d3d3",
                    background: "#356985",
                    fontFamily: openSans.style.fontFamily,
                  }}
                >
                  Remove Company
                </Button>
                <Modal
                  open={openCompanyDelete}
                  onClose={handleCloseCompanyDelete}
                >
                  <Box sx={modalStyle}>
                    <div className="flex flex-row-reverse">
                      <IconButton
                        onClick={handleCloseCompanyDelete}
                        sx={{ width: 40 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <h3 className="text-xl text-[#d3d3d3] m-1 basis-11/12">
                        Delete this Company?
                      </h3>
                    </div>

                    <p className="text-m text-[#d3d3d3] m-1">
                      This Company and all its warehouses will be deleted
                      permanetly!
                    </p>
                    <Button
                      onClick={() => DeleteCompany()}
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
              </div>
            </div>
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
    </main>
  );
}
