"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  function ToLogin() {
    router.push("/login");
  }

  React.useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-1/12 bg1"></div>
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-11/12 bg2">
        <div className="bg1 rounded-2xl h-full mx-4 flex flex-col items-center">
          <div className="w-full basis-3/12"></div>
          <h1 className="text-3xl text-[#d3d3d3]">Welcome to</h1>
          <h1 className="text-3xl text-[#d3d3d3]">
            Warehouse Administration System
          </h1>
          <Button
            onClick={ToLogin}
            variant="contained"
            sx={{ marginTop: 3 }}
            style={{
              color: "#d3d3d3",
              background: "#356985",
              width: "300px",
            }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            sx={{ marginTop: 3 }}
            style={{
              color: "#d3d3d3",
              background: "#356985",
              width: "300px",
            }}
          >
            Register
          </Button>
        </div>
      </div>
      <div className="... w-full basis-3 bg2"></div>
      <div className="... w-full basis-1/12 bg1 flex flex-col items-center">
        <h3 className="text-xl text-[#d3d3d3] m-1">
          Warehouse Administration System
        </h3>
        <p className="text-m text-[#d3d3d3] m-1">Simonas Nalivaika</p>
      </div>
      <div className="... w-full basis-3 bg2"></div>
    </div>
  );
}
