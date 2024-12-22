import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { OrderContext, KarigarContext } from "../context";
import { uploadImagesToS3, deleteImageFromS3 } from "../server/api";

const OrderForm = ({ open, setOpen, order, setOrder, handleCloseModal }) => {
  const initialOrderData = {
    client: "",
    karat: "18K",
    karigar_id: undefined,
    weight: "",
    description: "",
    placed_date: "",
    delivery_date: "",
    images: [],
    status: "active",
    customKarat: "",
    placed_by: "purnim",
  };

  const { karigars } = useContext(KarigarContext);
  const { addOrder, updateOrder } = useContext(OrderContext);

  const [orderData, setOrderData] = useState(initialOrderData);
  const [imageFiles, setImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      const imageUrls = order.order_images.map((image) => image.imageUrl);

      const isCustomKarat = !["18K", "20K", "22K"].includes(order.karat);

      setOrderData({
        ...initialOrderData,
        ...order,
        images: imageUrls,
        karigar_id: order.karigar_id || order.karigar?.id,
        client: order.client || "",
        weight: order.weight || "",
        placed_date: order.placed_date || "",
        delivery_date: order.delivery_date || "",
        customKarat: isCustomKarat ? order.karat : "", // If custom, set it in customKarat
        karat: isCustomKarat ? "other" : order.karat, // Set 'other' for custom values
      });
    }
  }, [order]);

  useEffect(() => {
    const isFormValid =
      orderData.weight &&
      orderData.placed_date &&
      orderData.delivery_date &&
      orderData.karigar_id &&
      orderData.client &&
      (orderData.karat !== "other" || orderData.customKarat);
    setIsValid(isFormValid);
  }, [orderData]);

  const handleClose = () => {
    setOrderData(initialOrderData);
    setImageFiles([]);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    setOrderData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...imagePreviews],
    }));
    setImageFiles([...imageFiles, ...files]); // Store files for S3 upload

    e.target.value = "";
  };

  const removeImage = (index) => {
    const imageToRemove = orderData.images[index];
    if (imageToRemove?.startsWith("blob:")) {
      setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else {
      setDeletedImages((prevDeleted) => [...prevDeleted, imageToRemove]);
    }

    setOrderData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleCreateOrUpdateOrder = async () => {
    let id = order ? order.order_id : Date.now();
    let uploadedImageUrls = [];
    if (imageFiles.length > 0) {
      setLoading(true);
      uploadedImageUrls = await uploadImagesToS3(imageFiles, id);
      setLoading(false);
      if (!uploadedImageUrls) {
        alert("Failed to upload images");
        handleClose();
        return;
      }
    }

    // Remove images from S3
    if (deletedImages.length > 0) {
      setLoading(true);
      await deleteImageFromS3(deletedImages);
      setLoading(false);
    }
    const filteredImages = orderData.images.filter(
      (image) => !image?.startsWith("blob")
    );

    const currOrder = {
      order_id: id,
      ...orderData,
      karat:
        orderData.karat === "other" ? orderData.customKarat : orderData.karat,
      images: [...filteredImages, ...uploadedImageUrls],
    };
    if (order) {
      await updateOrder(currOrder);
      setOrder(currOrder);
      handleCloseModal();
    } else {
      await addOrder(currOrder);
    }

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, md: 600 },
          maxHeight: "85vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            textAlign: "center",
            marginBottom: 2,
            borderBottom: "2px solid #d1d1d1",
          }}
        >
          {order ? "Edit Order" : "Add New Order"}
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Karat</InputLabel>
                <Select
                  name="karat"
                  value={orderData.karat}
                  onChange={handleChange}
                >
                  <MenuItem value="18K">18K</MenuItem>
                  <MenuItem value="20K">20K</MenuItem>
                  <MenuItem value="22K">22K</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {orderData.karat === "other" && (
                <>
                  <TextField
                    fullWidth
                    label="Custom Karat"
                    name="customKarat"
                    value={orderData.customKarat}
                    onChange={handleChange}
                    margin="normal"
                    required
                    inputProps={{ maxLength: 20 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {`${orderData.customKarat.length}/20`}
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight"
                name="weight"
                value={orderData.weight}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ maxLength: 20 }}
              />
              <Typography variant="body2" color="textSecondary">
                {`${orderData.weight.length}/20`}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={orderData.description}
                onChange={handleChange}
                margin="normal"
                inputProps={{ maxLength: 200 }} // Limit to 200 characters
                required
              />
              <Typography variant="body2" color="textSecondary">
                {`${orderData.description.length}/200`}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <TextField
                  fullWidth
                  label="Client"
                  name="client"
                  value={orderData.client}
                  onChange={handleChange}
                  margin="normal"
                  required
                  inputProps={{ maxLength: 20 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {`${orderData.client.length}/20`}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Karigar</InputLabel>
                <Select
                  name="karigar_id"
                  value={orderData.karigar_id || ""}
                  onChange={handleChange}
                >
                  {karigars &&
                    [...karigars]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((karigar) => (
                        <MenuItem key={karigar?.id} value={karigar?.id}>
                          {karigar.name}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Order Date"
                name="placed_date"
                value={orderData.placed_date}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Delivery Date"
                name="delivery_date"
                value={orderData.delivery_date}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box
                mt={1}
                display="flex"
                sx={{
                  overflowX: orderData.images.length === 0 ? "none" : "scroll",
                  bgcolor: "#f5f5f5",
                  padding: "10px",
                }}
              >
                {orderData.images.length === 0 ? (
                  <Box
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.875rem" }} color="error">
                      No image selected
                    </Typography>
                  </Box>
                ) : (
                  orderData.images.map((image, index) => (
                    <Box key={index} sx={{ position: "relative", mr: 1 }}>
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                      <IconButton
                        onClick={() =>
                          removeImage(index, imageFiles.includes(image))
                        }
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bgcolor: "white",
                          borderRadius: "50%",
                          "&:hover": {
                            bgcolor: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{ fontSize: "0.8rem", color: "rgb(0 0 0)" }}
                        />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
              <FormControl fullWidth margin="normal">
                <Button
                  variant="outlined"
                  color="primary"
                  component="label"
                  startIcon={<FileUploadIcon />}
                  sx={{
                    textTransform: "none",
                    width: "fit-content",
                    margin: "auto",
                  }}
                >
                  Add Images
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          <Box
            mt={2}
            display="flex"
            justifyContent="flex-end"
            flexDirection="column"
          >
            {!isValid && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Please fill all mandatory fields marked with *
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateOrUpdateOrder}
              disabled={!isValid || loading} // Disable button if form is not valid or loading
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "" : order ? "Edit Order" : "Create Order"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default OrderForm;
