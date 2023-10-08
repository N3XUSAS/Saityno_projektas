using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;
using Warehouse_App.Dtos;
using Warehouse_App.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Warehouse_App.Controllers
{
    [Route("api/companies/{companyId}/warehouses/{warehouseId}/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {

        private readonly AppDB appDB;

        public OrderController(AppDB DB)
        {
            appDB = DB;
        }

        // GET: api/<OrderController>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        //public async Task<IEnumerable<OrderDto>> Get([FromRoute] int companyId, [FromRoute] int warehouseId)
        //{
        //    var company = await appDB.Companies.FindAsync(companyId);
        //    if(company == null)
        //    {
        //        return (IEnumerable<OrderDto>)NotFound("Company do not exist");
        //    }
        //    else
        //    {
        //        var warehouse = await appDB.Warehouses.FindAsync(warehouseId);
        //        if(warehouse == null)
        //        {
        //            return (IEnumerable<OrderDto>)NotFound("Warehouse do not exist");
        //        }
        //        else
        //        {
        //            var result = await appDB.Orders.Where(o => o.warehouse.warehouseId == warehouseId && o.warehouse.Company.companyId == companyId).ToListAsync();
        //            return result.Select(o => new OrderDto(o.code, o.deliveryCity, o.deliveryAddress, o.weigth, o.size, o.phone, o.created));
        //        }
        //    }
        //}
        public async Task<IActionResult> Get([FromRoute] int companyId, [FromRoute] int warehouseId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {

                var warehouse = await appDB.Warehouses.FirstOrDefaultAsync(w => w.Company.companyId == companyId && w.warehouseId == warehouseId);
                if (warehouse == null)
                {
                    return NotFound("Warehouse does not exist");
                }
                else
                {

                    var result = await appDB.Orders
                        .Where(o => o.warehouse.warehouseId == warehouseId && o.warehouse.Company.companyId == companyId)
                        .ToListAsync();

                    if (result.Count == 0)
                    {
                        return NoContent(); // Return 204 No Content when no orders are found.
                    }

                    return Ok(result.Select(o => new OrderDto(o.code, o.deliveryCity, o.deliveryAddress, o.weigth, o.size, o.phone, o.created)));
                }
            }
        }

        // GET api/<OrderController>/5
        [HttpGet]
        [Route("{orderId}", Name = "GetOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDto>> Get(int orderId, [FromRoute] int warehouseId, [FromRoute] int companyId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var warehouse = await appDB.Warehouses.FirstOrDefaultAsync(w => w.Company.companyId == companyId && w.warehouseId == warehouseId);
                if (warehouse == null)
                {
                    return NotFound("Warehouse does not exist");
                }
                else
                {
                    var result = await appDB.Orders.FirstOrDefaultAsync(o => o.orderId == orderId && o.warehouse.warehouseId == warehouseId && o.warehouse.Company.companyId == companyId);
                    if (result == null)
                    {
                        return NotFound("Order does not exist");
                    }
                    else
                    {
                        return Ok(new OrderDto(result.code, result.deliveryCity, result.deliveryAddress, result.weigth, result.size, result.phone, result.created));
                    }
                }
            }
        }

        // POST api/<OrderController>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<ActionResult<OrderDto>> Post([FromBody] CreateEditOrderDto createEditOrderDto, [FromRoute] int companyId, [FromRoute] int warehouseId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var warehouse = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                if(warehouse == null)
                {
                    return NotFound("Warehouse does not exist");
                }
                else
                {
                    if (ModelState.IsValid)
                    {
                        string generatedCode = Generator();
                        var result = new Order { code = generatedCode, deliveryCity = createEditOrderDto.deliveryCity, deliveryAddress = createEditOrderDto.deliveryAddress, warehouse = warehouse, weigth = createEditOrderDto.weight, size = createEditOrderDto.size, phone = createEditOrderDto.phone, created = DateTime.Now };
                        appDB.Orders.Add(result);
                        await appDB.SaveChangesAsync();

                        return CreatedAtRoute("GetOrder", new { orderId = result.orderId, warehouseId = warehouseId, companyId = companyId }, result);
                    }
                    else
                    {
                        return UnprocessableEntity();
                    }
                    
                }
            }
        }

        // PUT api/<OrderController>/5
        [HttpPut("{orderId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<ActionResult<OrderDto>> Put(int orderId, [FromRoute] int warehouseId, [FromRoute] int companyId, CreateEditOrderDto createEditOrderDto)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var warehouse = await appDB.Warehouses.FirstOrDefaultAsync(w => w.Company.companyId == companyId && w.warehouseId == warehouseId);
                if (warehouse == null)
                {
                    return NotFound("Warehouse do not exist");
                }
                else
                {
                    var result = await appDB.Orders.FirstOrDefaultAsync(o => o.orderId == orderId && o.warehouse.warehouseId == warehouseId && o.warehouse.Company.companyId == companyId);
                    if (result == null)
                    {
                        return NotFound("Order do not exist");
                    }
                    else
                    {
                        if (ModelState.IsValid)
                        {
                            result.deliveryCity = createEditOrderDto.deliveryCity;
                            result.deliveryAddress = createEditOrderDto.deliveryAddress;
                            result.weigth = createEditOrderDto.weight;
                            result.size = createEditOrderDto.size;
                            result.phone = createEditOrderDto.phone;
                            appDB.Orders.Update(result);
                            await appDB.SaveChangesAsync();

                            return Ok(new OrderDto(result.code, result.deliveryCity, result.deliveryAddress, result.weigth, result.size, result.phone, result.created));
                        }
                        else
                        {
                            return UnprocessableEntity("");
                        }
                    }
                }
            }
            
        }

        // DELETE api/<OrderController>/5
        [HttpDelete("{orderId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(int orderId, [FromRoute] int warehouseId, [FromRoute] int companyId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var warehouse = await appDB.Warehouses.FirstOrDefaultAsync(w => w.Company.companyId == companyId && w.warehouseId == warehouseId);
                if (warehouse == null)
                {
                    return NotFound("Warehouse does not exist");
                }
                else
                {
                    var result = await appDB.Orders.FirstOrDefaultAsync(o => o.orderId == orderId && o.warehouse.warehouseId == warehouseId && o.warehouse.Company.companyId == companyId);
                    if (result == null)
                    {
                        return NotFound("Order does not exist");
                    }
                    else
                    {
                        appDB.Orders.Remove(result);
                        await appDB.SaveChangesAsync();

                        return NoContent();
                    }
                }
            }

        }

        private string Generator()
        {
            string code = "";
            bool pass = false;
            while (pass == false)
            {
                Random rnd = new Random();
                code = rnd.Next(10).ToString();
                code = code +  rnd.Next(10).ToString();
                code = code + rnd.Next(10).ToString();
                code = code + rnd.Next(10).ToString();
                code = code + rnd.Next(10).ToString();
                var result = appDB.Orders.Where(o => o.code == code).FirstOrDefault();
                if(result == null)
                {
                    pass = true;
                }
            }
            return code;
            
        }
    }
}
