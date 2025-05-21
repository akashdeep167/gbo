import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../pictures/logo.png";
import OrderForm from "./OrderForm";
import KarigarList from "./KarigarList";
import UserManagementModal from "./UserManagementModal";
import { UserContext } from "../context";

export default function Header() {
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openKarigarModal, setOpenKarigarModal] = useState(false);
  const [openUserManagementModal, setOpenUserManagementModal] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { logout, isAdmin, user } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpen = () => {
    setOpen(true);
    handleCloseNavMenu(false);
  };

  const handleOpenKarigarModal = () => setOpenKarigarModal(true);
  const handleCloseKarigarModal = () => setOpenKarigarModal(false);

  const handleOpenUserManagementModal = () => {
    setOpenUserManagementModal(true);
    handleCloseUserMenu();
  };
  const handleCloseUserManagementModal = () =>
    setOpenUserManagementModal(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
    handleCloseNavMenu();
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#2E2E2E" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: "46px", md: "46px !important" },
              px: { xs: 2, md: 3 },
              maxHeight: "50px",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="LOGO"
              onClick={handleLogoClick}
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                width: { md: "80px" },
                backgroundColor: "white",
                padding: "0px 5px",
                position: "absolute",
                left: { md: "24px" },
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem key="home">
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      borderBottom:
                        currentPage === "home" ? "1px solid black" : "0px",
                    }}
                    textAlign="center"
                    onClick={() => handleNavigate("home")}
                  >
                    Home
                  </Typography>
                </MenuItem>
                <MenuItem key="orders">
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      borderBottom:
                        currentPage === "orders" ? "1px solid black" : "0px",
                    }}
                    textAlign="center"
                    onClick={() => handleNavigate("orders")}
                  >
                    Orders
                  </Typography>
                </MenuItem>
                {isAdmin && (
                  <MenuItem key="history">
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        borderBottom:
                          currentPage === "history" ? "1px solid black" : "0px",
                      }}
                      textAlign="center"
                      onClick={() => handleNavigate("history")}
                    >
                      History
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem>
                  <Typography
                    textAlign="center"
                    sx={{ textTransform: "uppercase" }}
                    onClick={handleOpen}
                  >
                    Add Order
                  </Typography>
                </MenuItem>

                <MenuItem>
                  <Typography
                    textAlign="center"
                    sx={{ textTransform: "uppercase" }}
                    onClick={handleOpenKarigarModal}
                  >
                    Karigars
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box
              component="img"
              src={logo}
              alt="LOGO"
              onClick={handleLogoClick}
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 1,
                width: { xs: "80px" },
                backgroundColor: "white",
                padding: "0px 5px",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
              }}
            />
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <Button
                key="home"
                onClick={() => handleNavigate("home")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  boxShadow:
                    currentPage === "home" ? "0px 0px 5px 0px" : "none",
                }}
              >
                Home
              </Button>
              <Button
                key="orders"
                onClick={() => handleNavigate("orders")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  boxShadow:
                    currentPage === "orders" ? "0px 0px 5px 0px" : "none",
                }}
              >
                orders
              </Button>
              {isAdmin && (
                <Button
                  key="history"
                  onClick={() => handleNavigate("history")}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    boxShadow:
                      currentPage === "history" ? "0px 0px 5px 0px" : "none",
                  }}
                >
                  history
                </Button>
              )}

              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleOpen}
              >
                ADD ORDER
              </Button>

              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleOpenKarigarModal}
              >
                KARIGARS
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Button
                onClick={handleOpenUserMenu}
                sx={{ p: 0, color: "white" }}
              >
                User: {user}
              </Button>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAdmin && (
                  <MenuItem
                    key="UserManagement"
                    onClick={handleOpenUserManagementModal}
                  >
                    <Typography textAlign="center">
                      Users (Admin only)
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  key="Logout"
                  onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <OrderForm open={open} setOpen={setOpen} />
      <KarigarList
        openKarigarModal={openKarigarModal}
        setOpenKarigarModal={setOpenKarigarModal}
        handleCloseKarigarModal={handleCloseKarigarModal}
      />
      <UserManagementModal
        open={openUserManagementModal}
        onClose={handleCloseUserManagementModal}
      />
    </>
  );
}
