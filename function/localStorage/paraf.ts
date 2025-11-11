export const SetParafStorage = (paraf: string) => {
  try {
    localStorage.setItem("Paraf", paraf);
    return true;
  } catch (error) {
    console.error("Error setting Paraf localStorage data:", error);
    return false;
  }
};

export const GetParafStorage = () => {
  try {
    const parafData = localStorage.getItem("Paraf");
    if (parafData) {
      return parafData;
    }
    return null;
  } catch (error) {
    console.error("Error getting Paraf localStorage data:", error);
    return null;
  }
};

export const ResetParafStorage = () => {
  try {
    localStorage.removeItem("Paraf");
    return true;
  } catch (error) {
    console.error("Error removing Paraf localStorage data:", error);
    return false;
  }
};
