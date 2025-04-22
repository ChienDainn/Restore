import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Tooltip
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Card
      elevation={6}
      sx={{
        width: 300,
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
        "&:hover": {
          boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Image with Hover Overlay */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="240"
          image={product.pictureUrl}
          alt={product.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
        {/* Optional badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "secondary.main",
            color: "white",
            px: 1.2,
            py: 0.4,
            fontSize: 12,
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          NEW
        </Box>
      </Box>

      {/* Product Info */}
      <CardContent sx={{ px: 2, pb: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: 0.5,
            mb: 0.5,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          ${(product.price / 100).toFixed(2)}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 2,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="Add this item to your cart" arrow>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
                borderColor: "primary.light",
              },
            }}
          >
            Add to cart
          </Button>
        </Tooltip>

        <Button
          variant="contained"
          size="small"
          component={Link}
          to={`/catalog/${product.id}`}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}
