import { useParams } from "react-router-dom";
import {
  Button,
  Divider,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import { useFetchProductDetailsQuery } from "./catalogAPI";
import { useAppDispatch } from "../../app/store/store";
import { startLoading, stopLoading } from "../../app/layout/uiSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    data: product,
    isLoading,
    isFetching
  } = useFetchProductDetailsQuery(id ? +id : 0, {
    refetchOnMountOrArgChange: true
  });

  // 💡 Kích hoạt loading đúng lúc query bắt đầu
  useEffect(() => {
    if (isLoading || isFetching) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  }, [isLoading, isFetching, dispatch]);

  if (!product) return <div>Loading...</div>;

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in stock", value: product.quantityInStock }
  ];

  return (
    <Grid2 container spacing={6} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img src={product?.pictureUrl} alt={product.name} style={{ width: "100%" }} />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table sx={{ "& td": { fontSize: "1rem" } }}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold" }}>{detail.label}</TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2 container spacing={2} marginTop={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              defaultValue={1}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              Add to Basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
