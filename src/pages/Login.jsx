import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../server/api";
import { UserContext } from "../context";
import bg from "../pictures/bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const initialFormData = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [invalid, setInvalid] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setInvalid(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = await loginApi(formData);
    if (user) {
      login(user.accessToken);
      navigate("/home");
    } else {
      setInvalid(true);
    }
    setFormData(initialFormData);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "#ffffff57",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {invalid && (
              <Typography sx={{ color: "red", fontSize: "12px" }}>
                *Invalid Credentials
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                padding: "10px 0",
                background: "linear-gradient(90deg, #2196f3, #21cbf3)",
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
