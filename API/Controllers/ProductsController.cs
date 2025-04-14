using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]


    public class ProductsController(StoreContext context) : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<Product>> GetProducts()
        {
            return context.Products.ToList();
        }

        [HttpGet("{id}")] // api/products/2
        public ActionResult<Product> GetProduct(int id)
        {
            var product = context.Products.Find(id);

            if (product == null) return NotFound();

            return product;
        }
    }
}
