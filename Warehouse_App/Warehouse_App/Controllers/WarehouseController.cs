using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;
using Warehouse_App.Dtos;
using Warehouse_App.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Warehouse_App.Controllers
{
    [Route("api/companies/{companyId}/warehouses")]
    [ApiController]
    public class WarehouseController : ControllerBase
    {

        private readonly AppDB appDB;

        public WarehouseController(AppDB DB)
        {
            appDB = DB;
        }

        // GET: api/<WarehouseController>
        // GET: api/<CompanyController>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        //public async Task<IEnumerable<WarehouseDto>> Get([FromRoute] int companyId)
        //{

        //    var company = await appDB.Companies.FindAsync(companyId);
        //    if (company == null)
        //    {
        //        return NotFound("Company do not exist");
        //    }
        //    else 
        //    {
        //        var result = await appDB.Warehouses.Where(w => w.Company.companyId == companyId).ToListAsync();
        //        return result.Select(w => new WarehouseDto(w.city, w.address, w.maneger));
        //    }

        //}
        public async Task<IActionResult> Get([FromRoute] int companyId)
        {
            var company = await appDB.Companies.FindAsync(companyId);

            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var result = await appDB.Warehouses.Where(w => w.Company.companyId == companyId)
                                                    .Select(w => new WarehouseDto(w.city, w.address, w.maneger))
                                                    .ToListAsync();

                return Ok(result);
            }
        }

        //GET api/<CompanyController>/5
        [HttpGet]
        [Route("{warehouseId}", Name = "GetWarehouse")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WarehouseDto>> Get(int warehouseId, [FromRoute] int companyId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var result = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                if (result == null)
                {
                    return NotFound("Warehouse does not exist");
                }
                else
                {
                    return Ok(new WarehouseDto(result.city, result.address, result.maneger));
                }
            }
            
        }

        //POST api/<CompanyController>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<WarehouseDto>> Post([FromBody] WarehouseDto warehouseDto, [FromRoute] int companyId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var result = new Warehouse { city = warehouseDto.city, address = warehouseDto.address, maneger = warehouseDto.maneger, Company = company };
                if (ModelState.IsValid)
                {
                    appDB.Warehouses.Add(result);
                    await appDB.SaveChangesAsync();

                    return CreatedAtRoute("GetWarehouse", new { warehouseId = result.warehouseId, companyId = companyId }, result);
                }
                else
                {
                    return UnprocessableEntity();
                }
                
            }
        }

        // PUT api/<CompanyController>/5
        [HttpPut("{warehouseId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<WarehouseDto>> Put(int warehouseId, [FromRoute] int companyId, WarehouseDto warehouseDto)
        {
            var company = await appDB.Warehouses.FindAsync(companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var result = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                if (result == null)
                {
                    return NotFound("Warehouse dose not exist");
                }
                else
                {
                    if(ModelState.IsValid)
                    {
                        result.city = warehouseDto.city;
                        result.address = warehouseDto.address;
                        result.maneger = warehouseDto.maneger;
                    
                        appDB.Warehouses.Update(result);
                        await appDB.SaveChangesAsync();

                        return Ok(new WarehouseDto(result.city, result.address, result.maneger));
                    }
                    else
                    {
                        return UnprocessableEntity("");
                    }
                }
            }
        }

        //// DELETE api/<CompanyController>/5
        [HttpDelete("{warehouseId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(int warehouseId, [FromRoute] int companyId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var result = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                if (result == null)
                {
                    return NotFound("Warehouse does not exist");
                }
                else
                {
                    appDB.Warehouses.Remove(result);
                    await appDB.SaveChangesAsync();

                    return NoContent();
                }
            }

        }
    }
}
