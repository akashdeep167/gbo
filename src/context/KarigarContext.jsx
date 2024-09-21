import React, { createContext, useEffect, useState } from "react";
import { tempKarigars } from "../constants/karigars";
import {
  addKarigars,
  deleteKarigars,
  getKarigars,
  updateKarigars,
} from "../server/api";
import AlertSnackbar from "../components/AlertSnackbar";

export const KarigarContext = createContext();

export const KarigarProvider = ({ children }) => {
  const [karigars, setKarigars] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false); // For Snackbar state
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // success or error

  useEffect(() => {
    const getAllKarigars = async () => {
      let res = await getKarigars();
      setKarigars(res.data);
    };
    getAllKarigars();
    setKarigars(tempKarigars);
  }, []);

  const addKarigar = async (newKarigar) => {
    // console.log("added new karigar: ", newKarigar);
    const res = await addKarigars(newKarigar);
    if (res.status === 200) {
      setKarigars((prevKarigars) => [...prevKarigars, res.data]);
      setAlertMessage("Karigar added successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } else {
      setAlertMessage(`Failed to add Karigar.`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const updateKarigar = async (updatedKarigar) => {
    const res = await updateKarigars(updatedKarigar);
    if (res.status === 200) {
      setKarigars((prevKarigars) =>
        prevKarigars.map((karigar) =>
          karigar.id === updatedKarigar.id
            ? { ...karigar, ...updatedKarigar }
            : karigar
        )
      );
      setAlertMessage("Karigar updated successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } else {
      setAlertMessage(`Failed to Update Karigar.`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const deleteKarigar = async (karigarId) => {
    const res = await deleteKarigars(karigarId);
    if (res.status === 200) {
      setKarigars((prevKarigars) =>
        prevKarigars.filter((karigar) => karigar.id !== karigarId)
      );
      setAlertMessage("Karigar deleted successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } else {
      setAlertMessage(`Failed to delete Karigar.`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  // const addTaskToKarigar = (karigarId, taskId) => {
  //   console.log("added task#", taskId);
  //   setKarigars((prevKarigars) =>
  //     prevKarigars.map((karigar) =>
  //       karigar.id === karigarId
  //         ? { ...karigar, tasks: [...karigar.tasks, taskId] }
  //         : karigar
  //     )
  //   );
  //   console.log(karigars);
  // };
  // const removeTaskFromKarigar = (karigarId, taskId) => {
  //   setKarigars((prevKarigars) =>
  //     prevKarigars.map((karigar) =>
  //       karigar.id === karigarId
  //         ? {
  //             ...karigar,
  //             tasks: karigar.tasks.filter((task) => task !== taskId),
  //           }
  //         : karigar
  //     )
  //   );
  // };

  return (
    <KarigarContext.Provider
      value={{
        karigars,
        addKarigar,
        updateKarigar,
        deleteKarigar,
        // addTaskToKarigar,
        // removeTaskFromKarigar,
      }}
    >
      {children}
      <AlertSnackbar
        alertOpen={alertOpen}
        alertSeverity={alertSeverity}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
    </KarigarContext.Provider>
  );
};
