import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/store/store";
import { startLoading } from "../../app/layout/uiSlice";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();

  return (
    <Card
      elevation={4}
      sx={{
        width: 280,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: '0.3s ease',
        '&:hover': {
          boxShadow: 10,
          transform: 'translateY(-4px)',
        }
      }}
    >
      <CardMedia
        sx={{ height: 220, backgroundSize: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="subtitle1"
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ${(product.price / 100).toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ 
        justifyContent: 'space-between', 
        px: 2, 
        pb: 2,
        gap: 1
      }}>
        <Button
          size="small"
          startIcon={<AddShoppingCartOutlinedIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            py: 1.5,
            minWidth: 0,
            flex: 1,
            color: 'text.primary',
            border: '2px solid', // Tăng độ dày border từ 1px lên 2px
            borderColor: 'text.secondary', // Sử dụng màu đậm hơn
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)', // Màu hover tinh tế
              borderColor: 'text.primary', // Border đậm hơn khi hover
              borderWidth: '2px' // Giữ nguyên độ dày khi hover
            }
          }}
        >
          Add
        </Button>

        <Button
          component={Link}
          to={`/catalog/${product.id}`}
          onClick={() => dispatch(startLoading())}
          size="small"
          variant="contained"
          endIcon={<VisibilityOutlinedIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            py: 1.5,
            minWidth: 0,
            flex: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: 'primary.dark'
            }
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
}