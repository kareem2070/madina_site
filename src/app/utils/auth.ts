export const checkLoginStatus = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  const res = await fetch("/api/check-login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data.isLoggedIn;
  } else {
    return false;
  }
};
