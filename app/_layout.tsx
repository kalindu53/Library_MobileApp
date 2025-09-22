import React from "react";
import "./../global.css";
import { AuthProvider } from "@/context/authcontext";
import { LoaderProvider } from "@/context/loaderContext"
import { Slot } from "expo-router";

const RootLayout = () => {
  return (
      <LoaderProvider>
        <AuthProvider>
          <Slot />
         </AuthProvider>
       </LoaderProvider>
  );
};

export default RootLayout;