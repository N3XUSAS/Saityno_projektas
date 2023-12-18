"use client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  weight: "800",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [showPassword, setShowPassword] = React.useState(false);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginData, setLoginData] = React.useState({
    accessToken: "",
    refreshToken: "",
  });
  const [tokenData, setTokenData] = React.useState();

  const [error, setError] = React.useState({
    username: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const router = useRouter();

  function ToDashboard() {
    router.push("/company_data");
  }

  const fetchData = async () => {
    let data = {
      accessToken: "",
      refreshToken: "",
    };
    try {
      // Replace 'your-api-endpoint' with your actual API endpoint
      const res = await axios
        .post("https://localhost:7296/api/auth/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          data = response.data;
          TokenDecoder(data.accessToken);
        })
        .catch((error) => {
          if (error.response.data === "Invalid username or password") {
            console.log(error.response.data);
            setError({ username: error.response.data, password: "" });
          } else {
            setError(error.response.data.errors);
          }
        });
    } catch (error) {}
  };

  function TokenDecoder(token: string) {
    if (token != " ") {
      const decoded = jwtDecode(token);
      const payloadArray = Object.entries(decoded);
      const role = payloadArray[3][1];
      const exp = decoded.exp as number;
      console.log(exp);
      localStorage.setItem("token", token);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      if (exp > currentTime && role == "SystemAdmin") {
        router.push("/admin_data");
      } else if (exp > currentTime && role == "CompanyAdmin") {
        router.push("/company_data");
      }
    }
  }

  React.useEffect(() => {
    localStorage.setItem("token", "");
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-1/12 bg1"></div>
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-11/12 bg2">
        <div className="bg1 rounded-2xl h-full mx-4 flex flex-col items-center">
          <div className="w-full basis-3/12"></div>
          <h1 className="text-3xl text-[#d3d3d3]">Log In</h1>
          <p className="text-m text-[#c10000] m-1">{error.username}</p>
          <p className="text-m text-[#c10000] m-1">{error.password}</p>
          <TextField
            id="standard-basic"
            label="Username"
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
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
              width: 300,
            }}
          />
          <TextField
            id="standard-basic"
            label="Password"
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
              width: 300,
            }}
          />
          <Button
            onClick={fetchData}
            variant="contained"
            sx={{ marginTop: 3, fontFamily: openSans.style.fontFamily }}
            style={{
              color: "#d3d3d3",
              background: "#356985",
              width: "300px",
            }}
          >
            Log In
          </Button>
          <p>{}</p>
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
