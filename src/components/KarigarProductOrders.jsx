import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { OrderContext } from "../context";
import OrderModal from "./OrderModal";
import { getBackgroundColor, formatDate, formatString } from "../utils";

const blink = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "5px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)",
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "calc(100vh - 200px)",
  overflow: "auto",
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#D4AF37",
  color: theme.palette.getContrastText("#D4AF37"),
  position: "sticky",
  left: 0,
  zIndex: 2,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#D4AF37",
  color: theme.palette.getContrastText("#D4AF37"),
  position: "sticky",
  top: 0,
  zIndex: 3,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 200,
  width: 200,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: "#FFFAF0",
  border: "1px solid #D4AF37",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(212, 175, 55, 0.15)",
    cursor: "pointer",
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#D4AF37",
    "&:hover": {
      backgroundColor: "rgba(212, 175, 55, 0.08)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#D4AF37",
  },
}));

const StyledChip = styled(Chip)(({ theme, date, status }) => ({
  backgroundColor: status === "complete" ? "#2e2e2e" : getBackgroundColor(date),
  color: status === "complete" ? "white" : "black",
  border: "1px solid #D4AF37",
  padding: theme.spacing(0.5, 1),
  "& .MuiChip-label": {
    padding: 0,
  },
  "&::before": {
    content: '""',
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: status === "complete" ? "white" : "black",
    marginRight: "6px",
    animation: `${blink} 1.5s infinite`,
  },
}));

const KarigarProductOrders = () => {
  const [showKarigarView, setShowKarigarView] = useState(true);
  const { orders } = useContext(OrderContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const newFilteredOrders =
      orders?.filter(
        (order) => order.status === "active" || order.status === "complete"
      ) || [];
    setFilteredOrders(newFilteredOrders);
  }, [orders]);

  const karigarOrders = useMemo(() => {
    const ordersByKarigar = {};
    filteredOrders.forEach((order) => {
      const karigarName = order.karigar ? order.karigar.name : "Not Assigned";
      if (!ordersByKarigar[karigarName]) {
        ordersByKarigar[karigarName] = [];
      }
      ordersByKarigar[karigarName].push(order);
    });

    // Sort the karigar names alphabetically
    const sortedKarigarOrders = {};
    Object.keys(ordersByKarigar)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        sortedKarigarOrders[key] = ordersByKarigar[key];
      });

    return sortedKarigarOrders;
  }, [filteredOrders]);

  const productOrders = useMemo(() => {
    const ordersByProduct = {};
    filteredOrders.forEach((order) => {
      if (!ordersByProduct[order.product]) {
        ordersByProduct[order.product] = [];
      }
      ordersByProduct[order.product].push(order);
    });

    // Sort the product names alphabetically
    const sortedProductOrders = {};
    Object.keys(ordersByProduct)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        sortedProductOrders[key] = ordersByProduct[key];
      });

    return sortedProductOrders;
  }, [filteredOrders]);

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const renderOrderCard = (order) => (
    <StyledCard
      key={order.order_id}
      onClick={() => handleCardClick(order)}
      sx={{
        backgroundColor:
          order.karat === "18K"
            ? "#c8c8c8"
            : order.karat === "20K"
            ? "#f77e93"
            : order.karat === "22K"
            ? "#00d9ff"
            : "transparent",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginRight: "5px" }}
          >
            {showKarigarView
              ? formatString(order?.product)
              : formatString(order?.karigar?.name)}
          </Typography>

          <StyledChip
            label={order.status === "active" ? "Active" : "Complete"}
            size="small"
            date={order.delivery_date}
            status={order.status}
          />
        </Box>
        <Typography variant="body2">Lot Weight: {order.lot_weight}</Typography>
        <Typography variant="body2">
          Placed: {formatDate(order.placed_date)}
        </Typography>
        <Typography variant="body2">
          Delivery: {formatDate(order.delivery_date)}
        </Typography>
        <Typography variant="body2">
          Description: {formatString(order.description, 20)}
        </Typography>
      </CardContent>
    </StyledCard>
  );

  return (
    <StyledBox>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          {showKarigarView ? "Karigar Orders" : "Product Orders"}
        </Typography>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={showKarigarView}
              onChange={(e) => setShowKarigarView(e.target.checked)}
              name="viewToggle"
            />
          }
          label={showKarigarView ? "Karigar View" : "Product View"}
          labelPlacement="start"
        />
      </Box>

      <StyledPaper>
        <StyledTableContainer>
          <Table stickyHeader aria-label="orders table">
            <TableHead>
              <TableRow>
                <StyledHeaderCell
                  sx={{
                    width: "200px",
                    textAlign: "center",
                    left: 0,
                    zIndex: 4,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {showKarigarView ? "Karigar Name" : "Product"}
                  </Typography>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Orders
                  </Typography>
                </StyledHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showKarigarView
                ? Object.entries(karigarOrders).map(
                    ([karigarName, orders], index) => (
                      <TableRow
                        key={karigarName}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#FFF8E1" : "inherit",
                        }}
                      >
                        <StyledTableCell
                          component="th"
                          scope="row"
                          sx={{ width: "200px", textAlign: "center" }}
                        >
                          <Typography variant="h6">
                            {formatString(karigarName)}
                          </Typography>
                        </StyledTableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              overflow: "hidden",
                            }}
                          >
                            {orders.map(renderOrderCard)}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )
                : Object.entries(productOrders).map(
                    ([product, orders], index) => {
                      return (
                        <TableRow
                          key={product}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#FFF8E1" : "inherit",
                          }}
                        >
                          <StyledTableCell
                            component="th"
                            scope="row"
                            sx={{ width: "200px", textAlign: "center" }}
                          >
                            <Typography variant="h6">
                              {formatString(product)}
                            </Typography>
                          </StyledTableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 2,
                                overflow: "hidden",
                              }}
                            >
                              {orders.map(renderOrderCard)}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>
      <OrderModal
        modalOpen={modalOpen}
        order={selectedOrder}
        handleCloseModal={handleCloseModal}
        setOrder={setSelectedOrder}
      />
    </StyledBox>
  );
};

export default KarigarProductOrders;
